#!/bin/bash

# Production Security & Health Check Script
# Run this before deploying to production

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0
WARNINGS=0

print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

# Header
clear
echo -e "${BLUE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════╗
║     Production Readiness & Security Check            ║
║     Portfolio Frontend - vladplk.mysmarttech.fr      ║
╚═══════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# 1. Check Docker
print_header "1. Docker Environment"
if command -v docker &> /dev/null; then
    check_pass "Docker is installed ($(docker --version | cut -d' ' -f3 | tr -d ','))"
else
    check_fail "Docker is not installed"
fi

if docker info &> /dev/null; then
    check_pass "Docker daemon is running"
else
    check_fail "Docker daemon is not running"
fi

# 2. Check Files
print_header "2. Required Files"
files=(
    "Dockerfile"
    "nginx.conf"
    "package.json"
    "vite.config.js"
    ".dockerignore"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        check_pass "$file exists"
    else
        check_fail "$file is missing"
    fi
done

# 3. Check SSL Certificates
print_header "3. SSL Certificates"
CERT_PATH="/etc/letsencrypt/live/vladplk.mysmarttech.fr"
LOCAL_CERT_PATH="certs"

if [ -d "$CERT_PATH" ]; then
    if [ -f "$CERT_PATH/fullchain.pem" ] && [ -f "$CERT_PATH/privkey.pem" ]; then
        check_pass "SSL certificates found in $CERT_PATH"
        
        # Check expiry
        if command -v openssl &> /dev/null; then
            EXPIRY=$(openssl x509 -in "$CERT_PATH/fullchain.pem" -noout -enddate 2>/dev/null | cut -d= -f2)
            if [ -n "$EXPIRY" ]; then
                check_pass "Certificate expires: $EXPIRY"
            fi
        fi
    else
        check_fail "SSL certificate files missing in $CERT_PATH"
    fi
elif [ -d "$LOCAL_CERT_PATH" ]; then
    if [ -f "$LOCAL_CERT_PATH/fullchain.pem" ] && [ -f "$LOCAL_CERT_PATH/privkey.pem" ]; then
        check_pass "SSL certificates found in $LOCAL_CERT_PATH/"
    else
        check_fail "SSL certificate files missing in $LOCAL_CERT_PATH/"
    fi
else
    check_fail "No SSL certificates found"
    echo -e "   ${YELLOW}Run: sudo certbot certonly --standalone -d vladplk.mysmarttech.fr${NC}"
fi

# 4. Validate nginx Configuration
print_header "4. nginx Configuration"
if docker run --rm -v "$(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf" nginx:1.27-alpine nginx -t &> /dev/null; then
    check_pass "nginx configuration is valid"
else
    check_fail "nginx configuration has errors"
    docker run --rm -v "$(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf" nginx:1.27-alpine nginx -t
fi

# Check for common issues
if grep -q "proxy_pass" nginx.conf; then
    check_warn "nginx.conf contains proxy_pass (should serve static files)"
fi

if grep -q "try_files.*index.html" nginx.conf; then
    check_pass "SPA fallback routing configured"
else
    check_warn "SPA fallback routing may not be configured"
fi

# 5. Build Test
print_header "5. Build Test"
if [ -d "node_modules" ]; then
    check_pass "node_modules exists"
else
    check_warn "node_modules not found (run: npm install)"
fi

if npm run build &> /dev/null; then
    check_pass "Production build successful"
    
    # Check dist size
    if [ -d "dist" ]; then
        DIST_SIZE=$(du -sh dist | cut -f1)
        check_pass "Build output size: $DIST_SIZE"
        
        # Check for index.html
        if [ -f "dist/index.html" ]; then
            check_pass "index.html generated"
        else
            check_fail "index.html not found in dist/"
        fi
    fi
else
    check_fail "Production build failed"
fi

# 6. Docker Build Test
print_header "6. Docker Build Test"
if docker build -t portfolio-test:check . &> /dev/null; then
    check_pass "Docker image builds successfully"
    
    # Check image size
    IMAGE_SIZE=$(docker images portfolio-test:check --format "{{.Size}}")
    check_pass "Docker image size: $IMAGE_SIZE"
    
    # Cleanup
    docker rmi portfolio-test:check &> /dev/null || true
else
    check_fail "Docker build failed"
fi

# 7. Security Checks
print_header "7. Security Configuration"

# Check for security headers in nginx.conf
security_headers=(
    "Strict-Transport-Security"
    "X-Frame-Options"
    "X-Content-Type-Options"
    "X-XSS-Protection"
)

for header in "${security_headers[@]}"; do
    if grep -q "$header" nginx.conf; then
        check_pass "$header configured"
    else
        check_warn "$header not configured"
    fi
done

# Check SSL protocols
if grep -q "ssl_protocols TLSv1.2 TLSv1.3" nginx.conf; then
    check_pass "Modern SSL protocols configured"
else
    check_warn "SSL protocols may not be optimally configured"
fi

# Check for non-root user in Dockerfile
if grep -q "USER nginx" Dockerfile; then
    check_pass "Container runs as non-root user"
else
    check_warn "Container may be running as root"
fi

# 8. Performance Checks
print_header "8. Performance Configuration"

# Check for gzip
if grep -q "gzip on" nginx.conf; then
    check_pass "Gzip compression enabled"
else
    check_warn "Gzip compression not configured"
fi

# Check for HTTP/2
if grep -q "http2" nginx.conf; then
    check_pass "HTTP/2 enabled"
else
    check_warn "HTTP/2 not enabled"
fi

# Check for caching
if grep -q "expires" nginx.conf; then
    check_pass "Static asset caching configured"
else
    check_warn "Asset caching not configured"
fi

# Check vite config
if grep -q "minify" vite.config.js; then
    check_pass "Minification configured in Vite"
else
    check_warn "Minification may not be configured"
fi

# 9. DNS Check (optional)
print_header "9. DNS Configuration"
if command -v dig &> /dev/null; then
    DNS_RESULT=$(dig +short vladplk.mysmarttech.fr A | head -1)
    if [ -n "$DNS_RESULT" ]; then
        check_pass "DNS resolves to: $DNS_RESULT"
    else
        check_warn "DNS not configured or not resolving"
    fi
else
    check_warn "dig not installed, skipping DNS check"
fi

# 10. Port Availability
print_header "10. Port Availability"
for port in 80 443; do
    if lsof -i :$port &> /dev/null 2>&1 || ss -tuln | grep -q ":$port " 2>&1; then
        check_warn "Port $port is already in use"
    else
        check_pass "Port $port is available"
    fi
done

# Summary
print_header "Summary"
TOTAL=$((PASSED + FAILED + WARNINGS))

echo -e "${GREEN}Passed:${NC}   $PASSED/$TOTAL"
echo -e "${RED}Failed:${NC}   $FAILED/$TOTAL"
echo -e "${YELLOW}Warnings:${NC} $WARNINGS/$TOTAL"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║            ✓ READY FOR PRODUCTION ✓                  ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo -e "  1. Deploy: ${GREEN}make deploy${NC}"
    echo -e "  2. Or:     ${GREEN}docker-compose up -d --build${NC}"
    echo -e "  3. Check:  ${GREEN}make health${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}╔═══════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║          ✗ NOT READY FOR PRODUCTION ✗                ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${RED}Please fix the failed checks before deploying.${NC}"
    echo ""
    exit 1
fi

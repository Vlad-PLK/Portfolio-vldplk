# Portfolio Frontend - Production Ready 🚀

**Production-ready React portfolio with nginx, SSL/TLS, Docker, and comprehensive security.**

[![Production Ready](https://img.shields.io/badge/production-ready-green.svg)](https://vladplk.mysmarttech.fr)
[![Docker](https://img.shields.io/badge/docker-supported-blue.svg)](Dockerfile)
[![SSL](https://img.shields.io/badge/SSL-A+-brightgreen.svg)](https://www.ssllabs.com/ssltest/)

## 🌟 Features

- ✅ **Production-Ready**: Optimized Dockerfile with security best practices
- ✅ **SSL/TLS**: Modern HTTPS configuration with Let's Encrypt support
- ✅ **Security**: Non-root user, security headers, HSTS, OCSP stapling
- ✅ **Performance**: Gzip compression, HTTP/2, asset caching, code splitting
- ✅ **Monitoring**: Health checks, logging, resource limits
- ✅ **Easy Deployment**: Makefile with 25+ automated commands
- ✅ **SPA Routing**: Proper nginx configuration for React Router

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Development](#-development)
- [Production Deployment](#-production-deployment)
- [Architecture](#-architecture)
- [Documentation](#-documentation)
- [Maintenance](#-maintenance)

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- SSL certificates (Let's Encrypt recommended)

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Production Deployment

```bash
# 1. Check production readiness
./check-production.sh

# 2. Deploy with one command
make deploy

# 3. Check status
make health
```

## 💻 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### Project Structure

```
pf-react/
├── public/              # Static assets
├── src/                 # Source code
│   ├── WelcomePagePortfolio.jsx
│   └── main.jsx
├── Dockerfile           # Production Docker image
├── docker-compose.yml   # Docker Compose config
├── nginx.conf           # nginx configuration
├── vite.config.js       # Vite configuration
└── Makefile            # Deployment automation
```

## 🌍 Production Deployment

### Step 1: SSL Certificates

```bash
# Option A: Let's Encrypt (Recommended)
sudo certbot certonly --standalone -d vladplk.mysmarttech.fr

# Option B: Copy to certs/ directory
mkdir -p certs
cp /path/to/fullchain.pem certs/
cp /path/to/privkey.pem certs/
cp /path/to/chain.pem certs/
```

### Step 2: Deploy

```bash
# Full automated deployment
make deploy

# Or with docker-compose
docker-compose up -d --build

# Or manually
docker build -t portfolio-frontend .
docker run -d -p 80:80 -p 443:443 portfolio-frontend
```

### Step 3: Verify

```bash
# Check health
make health

# View logs
make logs

# Test HTTPS
curl -I https://vladplk.mysmarttech.fr

# Test SSL
make ssl-check
```

## 🏗️ Architecture

```
User → nginx (HTTPS) → Static React App
         ↓
    SSL/TLS Termination
    Security Headers
    Gzip Compression
    Asset Caching
```

### Technology Stack

- **Frontend**: React 19 + Vite
- **Server**: nginx 1.27-alpine
- **Container**: Docker multi-stage build
- **SSL/TLS**: Let's Encrypt certificates
- **Deployment**: Docker Compose + Makefile

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [DEPLOYMENT.md](DEPLOYMENT.md) | Complete deployment guide |
| [PRODUCTION_REVIEW.md](PRODUCTION_REVIEW.md) | Detailed production audit |
| [SUMMARY.md](SUMMARY.md) | Quick reference guide |

## 🛠️ Makefile Commands

### Essential Commands

```bash
make help           # Show all available commands
make deploy         # Full deployment pipeline
make health         # Check container health
make logs           # View container logs
make update         # Pull latest code and redeploy
```

### Development

```bash
make install        # Install dependencies
make build-local   # Build React app locally
make lint          # Run ESLint
make test-local    # Test build locally
```

### Docker Operations

```bash
make build         # Build Docker image
make test          # Test Docker build
make run           # Run container
make stop          # Stop container
make clean         # Remove container & images
```

### Maintenance

```bash
make ssl-renew     # Renew SSL certificates
make ssl-check     # Check certificate validity
make backup-image  # Backup Docker image
make validate-nginx # Validate nginx config
make prod-check    # Pre-deployment checks
```

## 🔒 Security Features

### SSL/TLS
- ✅ TLS 1.2 & 1.3 only
- ✅ Strong cipher suites
- ✅ OCSP stapling
- ✅ HSTS with preload

### Security Headers
- ✅ Strict-Transport-Security
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options
- ✅ X-XSS-Protection
- ✅ Referrer-Policy
- ✅ Permissions-Policy

### Container Security
- ✅ Non-root user (nginx)
- ✅ No new privileges
- ✅ Resource limits
- ✅ Health checks
- ✅ Read-only volumes

## ⚡ Performance Optimizations

### Build Optimizations
- Code splitting (vendor chunks)
- Minification (esbuild)
- Tree shaking
- Asset optimization

### Server Optimizations
- Gzip compression
- HTTP/2 support
- Static asset caching (1 year)
- No-cache for HTML

### Expected Metrics
- **First Contentful Paint**: < 1.8s
- **Lighthouse Score**: 90+
- **SSL Labs Rating**: A/A+
- **Bundle Size**: ~150-300KB (gzipped)

## 🔧 Maintenance

### Update Application

```bash
# Pull latest code and redeploy
make update

# Or manually
git pull
make deploy
```

### Monitor Health

```bash
# Check status
make health

# View logs
make logs

# Resource usage
make stats
```

### SSL Certificate Renewal

```bash
# Manual renewal
make ssl-renew

# Setup auto-renewal (cronjob)
0 0 * * 0 certbot renew --quiet && docker exec portfolio-frontend nginx -s reload
```

## 🧪 Testing

### Pre-Deployment Checks

```bash
# Automated production readiness check
./check-production.sh

# Or with make
make prod-check
```

### Manual Testing

```bash
# Test HTTPS
curl -I https://vladplk.mysmarttech.fr

# Test redirect
curl -I http://vladplk.mysmarttech.fr

# Test health endpoint
curl https://vladplk.mysmarttech.fr/health

# Test SSL quality
openssl s_client -connect vladplk.mysmarttech.fr:443
```

### External Testing

- **SSL Labs**: https://www.ssllabs.com/ssltest/
- **Lighthouse**: Chrome DevTools or web.dev
- **Security Headers**: https://securityheaders.com/

## 📊 Monitoring

### Health Checks

The application includes a health endpoint:

```bash
GET /health
Response: "healthy"
```

### Logging

```bash
# Container logs
make logs

# Follow logs in real-time
make logs-tail

# Docker Compose logs
docker-compose logs -f
```

### Metrics

```bash
# Resource usage
make stats

# Container inspection
make inspect
```

## 🐛 Troubleshooting

### Container won't start

```bash
# Check logs
docker logs portfolio-frontend

# Verify nginx config
make validate-nginx

# Check SSL certificates
ls -la /etc/letsencrypt/live/vladplk.mysmarttech.fr/
```

### SSL Errors

```bash
# Verify certificates in container
docker exec portfolio-frontend ls -la /etc/letsencrypt/live/vladplk.mysmarttech.fr/

# Check certificate validity
make ssl-check
```

### 404 on Routes

✅ Fixed: SPA fallback routing is configured in nginx.conf

## 📝 Environment Variables

Create `.env` file for custom configuration:

```bash
cp .env.example .env
```

See [.env.example](.env.example) for available options.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Test with `make prod-check`
4. Commit your changes
5. Push to the branch
6. Create a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Vladimir Polojienko**
- Website: [vladplk.mysmarttech.fr](https://vladplk.mysmarttech.fr)
- GitHub: [@Vlad-PLK](https://github.com/Vlad-PLK)
- LinkedIn: [vladimir-polojienko-735563307](https://www.linkedin.com/in/vladimir-polojienko-735563307)
- Email: leonpolo365@gmail.com

## 🙏 Acknowledgments

- React Team for the amazing framework
- Vite for blazing fast builds
- nginx for reliable web serving
- Let's Encrypt for free SSL certificates

---

**Made with ☕ and ❤️ by Vladimir Polojienko**

**Status**: ✅ Production Ready | **Version**: 1.0 | **Last Updated**: October 2025

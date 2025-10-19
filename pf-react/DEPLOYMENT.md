# Production Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. SSL Certificates Setup
You need SSL certificates for HTTPS. Two options:

#### Option A: Let's Encrypt (Recommended)
```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot

# Generate certificates
sudo certbot certonly --standalone -d vladplk.mysmarttech.fr

# Certificates will be in:
# /etc/letsencrypt/live/vladplk.mysmarttech.fr/
```

#### Option B: Bake Certificates into Image
```bash
# Create certs directory
mkdir -p certs

# Copy your certificates
cp /etc/letsencrypt/live/vladplk.mysmarttech.fr/fullchain.pem certs/
cp /etc/letsencrypt/live/vladplk.mysmarttech.fr/privkey.pem certs/
cp /etc/letsencrypt/live/vladplk.mysmarttech.fr/chain.pem certs/

# Update Dockerfile to uncomment COPY lines
```

### 2. Environment Setup

#### Create .env file (if needed)
```bash
# .env
NODE_ENV=production
VITE_API_URL=https://api.vladplk.mysmarttech.fr
```

### 3. Build Optimization

#### Update package.json scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:analyze": "vite build --mode analyze",
    "lint": "eslint .",
    "preview": "vite preview",
    "test:build": "npm run build && npm run preview"
  }
}
```

## 🚀 Deployment Steps

### Step 1: Test Locally
```bash
# Build the image
docker build -t portfolio-frontend:latest .

# Test run
docker run -d \
  -p 80:80 \
  -p 443:443 \
  --name portfolio-test \
  portfolio-frontend:latest

# Check logs
docker logs portfolio-test

# Test health endpoint
curl http://localhost/health

# Clean up
docker stop portfolio-test && docker rm portfolio-test
```

### Step 2: Production Deployment

#### Using Docker Compose (Recommended)
```bash
# Build and start
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

#### Using Docker directly
```bash
# Build
docker build -t portfolio-frontend:v1.0 .

# Run with volume mounts for SSL
docker run -d \
  --name portfolio-frontend \
  --restart unless-stopped \
  -p 80:80 \
  -p 443:443 \
  -v /etc/letsencrypt/live/vladplk.mysmarttech.fr/fullchain.pem:/etc/letsencrypt/live/vladplk.mysmarttech.fr/fullchain.pem:ro \
  -v /etc/letsencrypt/live/vladplk.mysmarttech.fr/privkey.pem:/etc/letsencrypt/live/vladplk.mysmarttech.fr/privkey.pem:ro \
  -v /etc/letsencrypt/live/vladplk.mysmarttech.fr/chain.pem:/etc/letsencrypt/live/vladplk.mysmarttech.fr/chain.pem:ro \
  portfolio-frontend:v1.0
```

### Step 3: Verify Deployment
```bash
# Check if container is running
docker ps | grep portfolio

# Test HTTP to HTTPS redirect
curl -I http://vladplk.mysmarttech.fr

# Test HTTPS
curl -I https://vladplk.mysmarttech.fr

# Test SSL
openssl s_client -connect vladplk.mysmarttech.fr:443 -servername vladplk.mysmarttech.fr

# Check health endpoint
curl https://vladplk.mysmarttech.fr/health
```

## 🔧 Maintenance

### Update SSL Certificates
```bash
# Renew certificates
sudo certbot renew

# Reload nginx in container
docker exec portfolio-frontend nginx -s reload

# Or restart container
docker-compose restart
```

### Monitor Logs
```bash
# Real-time logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service
docker-compose logs portfolio
```

### Update Application
```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Or with zero-downtime (if you have a load balancer)
docker-compose up -d --build --no-deps portfolio
```

## 🛡️ Security Best Practices

### 1. Regular Updates
```bash
# Update base images regularly
docker pull node:18-alpine
docker pull nginx:1.27-alpine
docker-compose build --no-cache
```

### 2. Firewall Configuration
```bash
# Allow only HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 3. SSL/TLS Testing
- Use [SSL Labs](https://www.ssllabs.com/ssltest/) to test your SSL configuration
- Aim for A+ rating

### 4. Security Headers
Already configured in nginx.conf:
- HSTS
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

## 📊 Performance Optimization

### 1. Enable Compression
Already configured in nginx.conf (gzip)

### 2. Cache Strategy
```nginx
# Static assets: 1 year cache
# HTML files: no-cache
```

### 3. Monitor Performance
```bash
# Check bundle size
npm run build

# Analyze build
npm install -D rollup-plugin-visualizer
# Add to vite.config.js and run build:analyze
```

### 4. CDN Integration (Optional)
For global distribution, consider:
- Cloudflare
- AWS CloudFront
- Fastly

## 🔍 Troubleshooting

### Container won't start
```bash
# Check logs
docker logs portfolio-frontend

# Verify nginx config
docker run --rm -v $(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf nginx:1.27-alpine nginx -t

# Check SSL certificates
ls -la /etc/letsencrypt/live/vladplk.mysmarttech.fr/
```

### SSL errors
```bash
# Verify certificate files exist
docker exec portfolio-frontend ls -la /etc/letsencrypt/live/vladplk.mysmarttech.fr/

# Check certificate validity
openssl x509 -in /etc/letsencrypt/live/vladplk.mysmarttech.fr/fullchain.pem -noout -dates
```

### 404 errors on routes
- SPA fallback is configured in nginx.conf
- All routes should fall back to index.html
- Verify nginx config is loaded correctly

## 📈 Monitoring & Alerting

### Health Checks
```bash
# Manual health check
curl https://vladplk.mysmarttech.fr/health

# Automated monitoring (setup with your monitoring tool)
# Examples: Prometheus, Grafana, UptimeRobot
```

### Container Metrics
```bash
# Resource usage
docker stats portfolio-frontend

# Inspect container
docker inspect portfolio-frontend
```

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Deploy Portfolio

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t portfolio:${{ github.sha }} .
      
      - name: Deploy to server
        run: |
          # SSH into server and deploy
          # Or use Docker registry and pull on server
```

## 📝 Backup & Recovery

### Backup Strategy
```bash
# Backup docker image
docker save portfolio-frontend:latest | gzip > portfolio-backup-$(date +%Y%m%d).tar.gz

# Backup SSL certificates
sudo tar -czf ssl-backup-$(date +%Y%m%d).tar.gz /etc/letsencrypt/
```

### Recovery
```bash
# Restore image
gunzip -c portfolio-backup-YYYYMMDD.tar.gz | docker load

# Restore SSL
sudo tar -xzf ssl-backup-YYYYMMDD.tar.gz -C /
```

## 🎯 Production Checklist

- [ ] SSL certificates configured
- [ ] Firewall rules set
- [ ] Health checks passing
- [ ] HTTPS working
- [ ] HTTP redirects to HTTPS
- [ ] Security headers configured
- [ ] Gzip compression enabled
- [ ] Static assets cached properly
- [ ] Container resource limits set
- [ ] Monitoring configured
- [ ] Backup strategy in place
- [ ] SSL auto-renewal configured
- [ ] Domain DNS properly configured

## 🌐 DNS Configuration

Ensure your domain points to your server:
```
A Record: vladplk.mysmarttech.fr → YOUR_SERVER_IP
```

## 📞 Support

For issues or questions:
- GitHub Issues: [Your Repo]
- Email: leonpolo365@gmail.com

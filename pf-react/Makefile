.PHONY: help build test run stop clean deploy logs health

# Variables
IMAGE_NAME=portfolio-frontend
VERSION=latest
CONTAINER_NAME=portfolio-frontend

# Colors for output
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[1;33m
NC=\033[0m # No Color

help: ## Show this help message
	@echo "$(GREEN)Portfolio Frontend - Production Deployment$(NC)"
	@echo ""
	@echo "$(YELLOW)Available targets:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'

install: ## Install dependencies locally
	@echo "$(YELLOW)Installing dependencies...$(NC)"
	npm install

build-local: ## Build the React app locally
	@echo "$(YELLOW)Building React app...$(NC)"
	npm run build

test-local: build-local ## Test the build locally
	@echo "$(YELLOW)Testing build locally...$(NC)"
	npm run preview

lint: ## Run ESLint
	@echo "$(YELLOW)Running linter...$(NC)"
	npm run lint

build: ## Build Docker image
	@echo "$(YELLOW)Building Docker image...$(NC)"
	docker build -t $(IMAGE_NAME):$(VERSION) .
	@echo "$(GREEN)✓ Docker image built successfully$(NC)"

build-no-cache: ## Build Docker image without cache
	@echo "$(YELLOW)Building Docker image without cache...$(NC)"
	docker build --no-cache -t $(IMAGE_NAME):$(VERSION) .
	@echo "$(GREEN)✓ Docker image built successfully$(NC)"

test: build ## Build and test the Docker image
	@echo "$(YELLOW)Testing Docker image...$(NC)"
	@docker run -d --name $(CONTAINER_NAME)-test -p 8080:80 $(IMAGE_NAME):$(VERSION)
	@sleep 3
	@echo "Testing health endpoint..."
	@curl -f http://localhost:8080/health || (echo "$(RED)✗ Health check failed$(NC)" && docker stop $(CONTAINER_NAME)-test && docker rm $(CONTAINER_NAME)-test && exit 1)
	@echo "$(GREEN)✓ Health check passed$(NC)"
	@docker stop $(CONTAINER_NAME)-test
	@docker rm $(CONTAINER_NAME)-test
	@echo "$(GREEN)✓ Tests passed successfully$(NC)"

run: ## Run the container
	@echo "$(YELLOW)Starting container...$(NC)"
	docker run -d \
		--name $(CONTAINER_NAME) \
		--restart unless-stopped \
		-p 80:80 \
		-p 443:443 \
		-v /etc/letsencrypt/live/vladplk.mysmarttech.fr/fullchain.pem:/etc/letsencrypt/live/vladplk.mysmarttech.fr/fullchain.pem:ro \
		-v /etc/letsencrypt/live/vladplk.mysmarttech.fr/privkey.pem:/etc/letsencrypt/live/vladplk.mysmarttech.fr/privkey.pem:ro \
		-v /etc/letsencrypt/live/vladplk.mysmarttech.fr/chain.pem:/etc/letsencrypt/live/vladplk.mysmarttech.fr/chain.pem:ro \
		$(IMAGE_NAME):$(VERSION)
	@echo "$(GREEN)✓ Container started successfully$(NC)"

compose-up: ## Start with docker-compose
	@echo "$(YELLOW)Starting with docker-compose...$(NC)"
	docker-compose up -d --build
	@echo "$(GREEN)✓ Services started successfully$(NC)"

compose-down: ## Stop docker-compose services
	@echo "$(YELLOW)Stopping docker-compose services...$(NC)"
	docker-compose down
	@echo "$(GREEN)✓ Services stopped$(NC)"

stop: ## Stop the container
	@echo "$(YELLOW)Stopping container...$(NC)"
	@docker stop $(CONTAINER_NAME) 2>/dev/null || true
	@echo "$(GREEN)✓ Container stopped$(NC)"

restart: stop run ## Restart the container

clean: stop ## Remove container and images
	@echo "$(YELLOW)Cleaning up...$(NC)"
	@docker rm $(CONTAINER_NAME) 2>/dev/null || true
	@docker rmi $(IMAGE_NAME):$(VERSION) 2>/dev/null || true
	@echo "$(GREEN)✓ Cleanup complete$(NC)"

logs: ## View container logs
	@docker logs -f $(CONTAINER_NAME)

logs-tail: ## View last 100 lines of logs
	@docker logs --tail=100 $(CONTAINER_NAME)

health: ## Check container health
	@echo "$(YELLOW)Checking container health...$(NC)"
	@docker ps --filter name=$(CONTAINER_NAME) --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
	@echo ""
	@echo "$(YELLOW)Testing health endpoint...$(NC)"
	@curl -f http://localhost/health && echo "$(GREEN)✓ Health check passed$(NC)" || echo "$(RED)✗ Health check failed$(NC)"

shell: ## Get a shell inside the container
	@docker exec -it $(CONTAINER_NAME) /bin/sh

inspect: ## Inspect the container
	@docker inspect $(CONTAINER_NAME)

stats: ## Show container resource usage
	@docker stats $(CONTAINER_NAME) --no-stream

deploy: clean build test run health ## Full deployment pipeline
	@echo "$(GREEN)✓ Deployment complete!$(NC)"

update: ## Update and redeploy
	@echo "$(YELLOW)Updating application...$(NC)"
	git pull
	$(MAKE) deploy

backup-image: ## Backup Docker image
	@echo "$(YELLOW)Backing up Docker image...$(NC)"
	docker save $(IMAGE_NAME):$(VERSION) | gzip > portfolio-backup-$(shell date +%Y%m%d-%H%M%S).tar.gz
	@echo "$(GREEN)✓ Backup created$(NC)"

prune: ## Remove unused Docker resources
	@echo "$(YELLOW)Pruning Docker resources...$(NC)"
	docker system prune -f
	@echo "$(GREEN)✓ Pruning complete$(NC)"

ssl-check: ## Check SSL certificate validity
	@echo "$(YELLOW)Checking SSL certificates...$(NC)"
	@openssl x509 -in /etc/letsencrypt/live/vladplk.mysmarttech.fr/fullchain.pem -noout -dates 2>/dev/null || echo "$(RED)✗ SSL certificate not found$(NC)"

ssl-renew: ## Renew SSL certificates
	@echo "$(YELLOW)Renewing SSL certificates...$(NC)"
	sudo certbot renew
	$(MAKE) reload-nginx

reload-nginx: ## Reload nginx in container
	@echo "$(YELLOW)Reloading nginx...$(NC)"
	docker exec $(CONTAINER_NAME) nginx -s reload
	@echo "$(GREEN)✓ Nginx reloaded$(NC)"

validate-nginx: ## Validate nginx configuration
	@echo "$(YELLOW)Validating nginx configuration...$(NC)"
	@docker run --rm -v $(shell pwd)/nginx.conf:/etc/nginx/conf.d/default.conf nginx:1.27-alpine nginx -t
	@echo "$(GREEN)✓ Nginx configuration is valid$(NC)"

prod-check: ## Production readiness check
	@echo "$(GREEN)=== Production Readiness Check ===$(NC)"
	@echo ""
	@echo "$(YELLOW)1. Checking nginx configuration...$(NC)"
	@$(MAKE) validate-nginx
	@echo ""
	@echo "$(YELLOW)2. Checking build locally...$(NC)"
	@npm run build > /dev/null 2>&1 && echo "$(GREEN)✓ Build successful$(NC)" || echo "$(RED)✗ Build failed$(NC)"
	@echo ""
	@echo "$(YELLOW)3. Checking Docker...$(NC)"
	@docker --version && echo "$(GREEN)✓ Docker is installed$(NC)" || echo "$(RED)✗ Docker not found$(NC)"
	@echo ""
	@echo "$(YELLOW)4. Checking SSL certificates...$(NC)"
	@test -f /etc/letsencrypt/live/vladplk.mysmarttech.fr/fullchain.pem && echo "$(GREEN)✓ SSL certificates found$(NC)" || echo "$(RED)✗ SSL certificates not found$(NC)"
	@echo ""
	@echo "$(GREEN)✓ Pre-deployment checks complete$(NC)"

.DEFAULT_GOAL := help

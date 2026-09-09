# Workshop rentals: development shortcuts.
# Usage: make <target>   (make help lists them all)

.DEFAULT_GOAL := help

.PHONY: help install up down logs reset dev start test lint format typecheck check clean

help: ## Show this help
	@grep -E '^[a-z-]+:.*##' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "} {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## Install the dependencies
	pnpm install

up: ## Start PostgreSQL (schema and seed data included)
	docker compose up -d

down: ## Stop PostgreSQL
	docker compose down

logs: ## Follow the database logs
	docker compose logs -f db

reset: ## Recreate the database from scratch
	docker compose down -v
	docker compose up -d

dev: ## Run the API with hot reload
	pnpm dev

start: ## Run the API
	pnpm start

test: ## Run the tests
	pnpm test

lint: ## Check the code
	pnpm lint

format: ## Format the project
	pnpm format

typecheck: ## Check the types
	pnpm typecheck

check: typecheck lint test ## Types, lint and tests

clean: ## Remove node_modules
	rm -rf node_modules

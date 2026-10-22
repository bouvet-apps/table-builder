.PHONY: default help prepare build lint test package watch deploy clean start

SRC_DIR := $(shell pwd)
CODE_DIR := $(SRC_DIR)/code
FRONTEND_DIR := $(CODE_DIR)/src/frontend

APP_NAME := $(shell grep '^projectName' $(CODE_DIR)/gradle.properties | cut -d'=' -f2 | tr -d '[:space:]' | sed 's/[^a-zA-Z0-9_-]//g')

SANDBOX_DIR := ~/.enonic/sandboxes/$(APP_NAME)
SANDBOX_VERSION := $(shell grep '^xpVersion' $(CODE_DIR)/gradle.properties | cut -d'=' -f2 | tr -d '[:space:]')

GIT_HOOKS_DIR := $(SRC_DIR)/scripts/hooks
GIT_HOOKS_SOURCES := $(shell find $(GIT_HOOKS_DIR))

DIST_DIR := $(CODE_DIR)/build/libs


default: package ## Default target when running make without specifying a target, runs package

help: ## Print this text
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

prepare: .git/hooks ## Install external tools and validate environment
	$(call check_external,git)
	$(call check_external,gradle)
	$(call check_external,java)
	$(call check_external,node)
	$(call check_external,enonic)

install_new_dependencies:
	@cd $(CODE_DIR) && ./gradlew npm_install

build: ## Optional build step, needed by compiled or transpiled languages
	# RUNNING Build
	@cd $(CODE_DIR) && ./gradlew npmBuild

lint: ## Checks if the code is written according to the styleguide.
	# RUNNING Lint
	@cd $(CODE_DIR) && ./gradlew npmLint

test: ## Run tests and generate a coverage report
	# RUNNING Test
	@cd $(CODE_DIR) && ./gradlew test --info

package: ## Create a deployment package
	# RUNNING Packaging
	@cd $(CODE_DIR) && ./gradlew packageApplication

package-p: ## Run packageApplication with profiling enabled, useful for debugging build performance issues. Generates a build scan (profiling report) which can be viewed in a browser.
	# RUNNING Packaging
	@cd $(CODE_DIR) && ./gradlew packageApplication --profile

watch: ## Watch - develop mode
	# RUNNING Watching
	@cd $(CODE_DIR) && npm run dev

deploy: ## Deploy deployment package to a runtime environment
	# RUNNING Deploy
	@cd $(CODE_DIR) && enonic project deploy $(APP_NAME)

server: $(SANDBOX_DIR) ## Set up development server. Create new sandbox if necessary
$(SANDBOX_DIR):
	# RUNNING Creating server
	@echo "Sandbox does not exist, creating sandbox $(APP_NAME)."
	@enonic sandbox create $(APP_NAME) -v $(SANDBOX_VERSION) --skip-template -f
	@cd $(CODE_DIR) && enonic project sandbox $(APP_NAME)

start: $(SANDBOX_DIR) ## Start the server
	# RUNNING Starting sandbox
	@enonic sandbox start $(APP_NAME) --dev

clean: ## Delete generated files
	# RUNNING Cleaning up
	@cd $(CODE_DIR) && ./gradlew clean
	-rm -rf $(CODE_DIR)/node_modules
	-rm -rf $(CODE_DIR)/build/private-libs
	-rm -rf $(FRONTEND_DIR)/node_modules

$(DIST_DIR):
	@mkdir -p $@

git-hooks: .git/hooks ## Installs the git-hooks
.git/hooks: $(GIT_HOOKS_SOURCES)
	rsync -avu --delete "$(GIT_HOOKS_DIR)/" "$@"
	chmod +x $@/*
	@touch $@

define check_external
	@if ! command -v $(1) >/dev/null 2>&1; then \
		echo "You have to install $(1)"; \
		exit 1; \
	fi
endef

REPORTER ?= list
TEST_DB=mongodb://localhost:27017/auth11-tests
TEST_NODE_ENV=test

test: node_modules
	@db=$(TEST_DB) PORT=5050 NODE_ENV=$(TEST_NODE_ENV) BASE_URL=/docs NODE_TLS_REJECT_UNAUTHORIZED=0 \
		./node_modules/.bin/mocha --reporter $(REPORTER)

node_modules:
	@npm i

test-shrinkwrap-status:
	@./node_modules/.bin/npm-shrinkwrap
	@git status | grep npm-shrinkwrap.json ; test "$$?" -eq 1
	@echo shrinkwrap is okay

test-sec-deps:
	@./node_modules/.bin/nsp audit-shrinkwrap

.PHONY: test

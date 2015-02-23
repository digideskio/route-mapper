
MOCHA = ./node_modules/.bin/mocha
BABEL = ./node_modules/.bin/babel-node
SRC = lib/*.js
OPTIONS =  "-r -g --blacklist 'regenerator,es6.templateLiterals'"

TESTS = test/*.test.js
IOJS_ENV ?= test

BIN = iojs

ifeq ($(findstring io.js, $(shell which node)),)
	BIN = node
endif

ifeq (node, $(BIN))
	FLAGS = --harmony
endif


test:
	@IOJS_ENV=$(IOJS_ENV) $(BIN) $(FLAGS) $(MOCHA) \
		--require test/babel \
		--require should \
		$(TESTS) \
		--bail

bench:
	@$(MAKE) -C benchmarks

koa:
	@$(BABEL) $(OPTIONS) ./examples/koa/index.js

express:
	@$(BABEL) $(OPTIONS) ./examples/express/index.js

.PHONY: test bench


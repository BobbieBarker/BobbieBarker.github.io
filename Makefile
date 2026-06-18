.DEFAULT_GOAL := help

.PHONY: help dev build check preview new post status

help:
	@bin/blog help

dev:
	@bin/blog dev

build:
	@bin/blog build

check:
	@bin/blog check

preview:
	@bin/blog preview

new post:
	@bin/blog new $(if $(DRY_RUN),--dry-run,) "$(TITLE)"

status:
	@bin/blog status

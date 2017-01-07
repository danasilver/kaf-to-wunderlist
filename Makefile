all: extension.zip

extension.zip:
	zip -r extension.zip lib/

.PHONY: all

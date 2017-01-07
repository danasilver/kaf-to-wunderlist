LIB=$(shell find lib -type f)

all: extension.zip

extension.zip: $(LIB)
	zip -r extension.zip lib/

.PHONY: all

npm:
	@npm install

npm-publish-%:
	npm version $* && git push && git push --tags && npm publish

npm-version-%:
	npm version $* && git push && git push --tags

lint:
	@./node_modules/.bin/eslint $$(find . -name '*.js' -not -path '*.specs.js' -not -path './node_modules/*' -not -path './lib/*')

clean:
	@rm -rf ./node_modules

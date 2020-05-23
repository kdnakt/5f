

build:
	@echo "Start build"
	rm -rf docs
	cd ./front-app && yarn build && mv ./build ./docs && mv ./docs ..
	rm ./docs/service-worker.js

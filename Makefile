

build:
	@echo "Start build"
	rm -rf docs
	cd ./front-app && yarn build && mv ./build ./docs && mv ./docs ..
	rm ./docs/service-worker.js

prod:
	@echo "Deploy Prod API"
	cd ./apigwt && sls deploy --stage prod --param="corsOrigin=https://kdnakt.github.io"

dev:
	@echo "Deploy Dev API"
	cd ./apigwt && sls deploy

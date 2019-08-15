#!/bin/bash

# https://hydra-api.docker.localhost/oauth2/auth?client_id=e68f1d2a-00aa-45e2-8a6b-6122d6e074e8&client_secret=248c9e2d-7f7a-48e0-a027-49aaa149c4c0&response_type=token&scope=openid&state=7b161ce7-f492-4192-b8a7-1f89f2b78e8e

docker run --rm -it \
  -e HYDRA_ADMIN_URL=http://hydra:4445 \
  --network traefik \
  oryd/hydra:v1.0.0 \
  clients create \
    --skip-tls-verify \
    --id e68f1d2a-00aa-45e2-8a6b-6122d6e074e8 \
    --secret 248c9e2d-7f7a-48e0-a027-49aaa149c4c0 \
    --name dev-localhost \
    --grant-types authorization_code,refresh_token,client_credentials,implicit \
    --response-types token,code,id_token \
    --scope openid,offline \
    --callbacks https://moleculer.docker.localhost/oauth2/callback

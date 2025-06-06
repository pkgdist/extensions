#!/usr/bin/env bash
set -u
set -e
do_build () { 
    cp $DENO_CERT .devcontainer/trusted_certs.pem
    pushd . 
        cd .devcontainer
        docker buildx bake dind && docker push lynsei/devcontainer.dind:latest
        docker buildx bake simple && docker push lynsei/devcontainer.deno:latest
        rm trusted_certs.pem
    popd
}

read -p "Confirm? (y/n) " -n 1 -r && [[ $REPLY =~ ^[Yy]$ ]] && do_build
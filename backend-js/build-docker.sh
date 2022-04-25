#!/bin/bash

IMAGE_NAME=qr-share
DOCKER_USER=zjor
TAG=$(git rev-parse --short HEAD)
CONTAINER_IMAGE=${DOCKER_USER}/${IMAGE_NAME}:${TAG}

docker build -t ${IMAGE_NAME} .
docker tag ${IMAGE_NAME} ${CONTAINER_IMAGE}

echo "Tagged image: ${CONTAINER_IMAGE}"

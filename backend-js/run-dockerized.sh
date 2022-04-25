#!/bin/bash

source ../poc-py/.env-filebase.sh

IMAGE=qr-share

docker run --rm \
  -e PORT=5000 \
  -e REGION=${REGION} \
  -e S3_API_KEY=${S3_API_KEY} \
  -e S3_SECRET=${S3_SECRET} \
  -e S3_ENDPOINT=${S3_ENDPOINT} \
  -p 5000:5000 \
  ${IMAGE}

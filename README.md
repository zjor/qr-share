# QR share

Instantly share files by uploading and getting publicly available URL as a QR code

## Deployment routine

1. Build frontend

- `cd ./frontend`
- `npm run build`

This will copy build files to backend directory

2. Build dockerized backend

- `cd ./backend-js`
- `./build-docker.sh`

3. Deploy helm chart

- `source .env-filebase.sh`
- ```bash
helm upgrade --create-namespace --namespace app-qrshare --install qrshare.io --set version=149ec6c --set s3.apiKey=${S3_API_KEY} --set s3.secret=${S3_SECRET} ./ops/qrshare.io
```

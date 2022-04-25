const AWS = require('aws-sdk')

const log = console.log

const credentials = {
    accessKeyId: process.env.S3_API_KEY,
    secretAccessKey : process.env.S3_SECRET
}

AWS.config.update({credentials: credentials, region: process.env.REGION})

class S3Service {
    constructor(bucket) {
        this.bucket = bucket
        this.s3 = new AWS.S3({ endpoint: process.env.S3_ENDPOINT })
    }

    async upload(filename, body) {
        const params = {
            Body: body,
            Bucket: this.bucket,
            Key: filename
        }
        return await new Promise((resolve, reject) => {
            this.s3.putObject(params, (err, data) => {
                if (err) {
                    log(err, err.stack)
                    reject(err)
                } else {
                    log(data)
                    resolve(data)
                }
            })
        })
    }

    async deleteObject(name) {
        const params = {
            Bucket: this.bucket,
            Key: name
        }
        return await new Promise((resolve, reject) => {
            this.s3.deleteObject(params, (err, data) => {
                if (err) {
                    log(err, err.stack)
                    reject(err)
                } else {
                    resolve(name)
                }
            })
        })
    }

    async removeOldObjects(thresholdSeconds) {
        const objects = await new Promise((resolve, reject) => {
            this.s3.listObjects({ Bucket: this.bucket }, (err, data) => {
                if (err) {
                    log(err, err.stack)
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
        const now = new Date()
        objects.Contents.forEach(item => {
            const { Key: key, LastModified: timestamp } = item
            log(key, timestamp)
            if ((now - timestamp) / 1000 > thresholdSeconds) {
                this.deleteObject(key).then(o => log(`'${o}' deleted`))
            }
        })
    }
}

module.exports.S3Service = S3Service

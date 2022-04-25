const express = require('express')
const morgan = require('morgan')
const path = require('path')
const cors = require('cors')
const fileUpload = require('express-fileupload')

const { S3Service } = require('./s3')

const log = console.log
const PORT = process.env.PORT || 5000

const s3Service = new S3Service('storage-abcd')

const app = express()
app.use(morgan('dev'))
app.use(cors())
app.use(fileUpload({
    limits: { fileSize: 25 * 1024 * 1024 }
}))

app.use('/css', express.static(path.join(__dirname, 'frontend/css')))
app.use('/images', express.static(path.join(__dirname, 'frontend/images')))
app.use('/js', express.static(path.join(__dirname, 'frontend/js')))

app.get('/', (req, res) => {
    s3Service.removeOldObjects(3600).then(_ => {})
    res.sendFile(path.join(__dirname+'/frontend/index.html'))
})

app.get('/favicon.ico', (req, res) =>
    res.sendFile(path.join(__dirname+'/frontend/favicon.ico')))

app.get('/manifest.json', (req, res) =>
    res.sendFile(path.join(__dirname+'/frontend/manifest.json')))


app.post('/api/upload', async (req, res) => {
    log(req.files)
    const { name, data } = req.files.file
    await s3Service.upload(name, data)
    res.send('ok')
})

app.listen(PORT, () => {
    log(`Listening as http://localhost:${PORT}`)
})

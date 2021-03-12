const express = require('express')
const multer = require('multer')
const Unzipper = require('decompress-zip')
const app = express()
const path = require('path')
const fs = require('fs')
const shelljs = require('shelljs')

// Creating file storage engine
const fileStorageEngine = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, './storage')
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

// Creating middleware
const upload = multer({ storage: fileStorageEngine })

// Upload the file
app.post('/single', upload.single('singleFile'), (req, res) => {
  const fileData = req.file
  res.json({ status: 'Single File sussessfully uploaded', data: fileData })
})

// Upload zipped files
app.post('/unzip', upload.single('singleFile'), (req, res) => {
  try {
    if (req.file) {
      //const fileData = req.file
      const filePath = path.join(req.file.destination, req.file.filename)
      const unzipper = new Unzipper(filePath)
      // console.log(filePath)

      // Unzipping
      unzipper.on('extract', () => console.log('Finished extracting'))

      // Unzip
      unzipper.extract({
        path: `/home/pratham82/Dev/file-upload-multer-nodejs/storage`,
      })

      // Deleting Zip file
      // fs.unlinkSync(filePath, () => console.log('File Scuccessfully Deleted.'))
    }
    res.json({
      status: 'Single File sussessfully uploaded, and file unzipped',
      // data: fileData,
    })
  } catch (e) {
    /* handle error */
    res.status(400).json({
      message: 'Errror in file upload',
    })
  }
})

//Upload multiple Files
app.post('/multiple', upload.array('multipleFiles', 3), (req, res) => {
  const filesData = req.files
  res.json({ status: 'Scuccessfully Uploaded', data: filesData })
})

// Test route
app.get('/api', (_, res) => res.send('File upload API'))

// FrontEnd route
app.get('/client', (_, res) => res.sendFile(path.join(__dirname, 'index.html')))

// Zipped route
app.get('/zipped', (_, res) =>
  res.sendFile(path.join(__dirname, 'zipped.html'))
)

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server is running on PORT: ${process.env.PORT || 3000}`)
)

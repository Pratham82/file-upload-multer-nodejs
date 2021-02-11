const express = require('express')
const multer = require('multer')
const app = express()
const path = require('path')

// Creating file storage engine
const fileStorageEngine = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, './storage')
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + '__' + file.originalname)
  },
})

// Creating middleware
const upload = multer({ storage: fileStorageEngine })

// Upload the file
app.post('/single', upload.single('singleFile'), (req, res) => {
  const fileData = req.file
  res.json({ status: 'Single File sussessfully uploaded', data: fileData })
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

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server is running on PORT: ${process.env.PORT || 3000}`)
)

const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Temporary "database" to store video metadata
let videos = [];

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save files to 'uploads' directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for video files only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for videos
  }
});

// POST /upload endpoint
app.post('/upload', upload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video uploaded' });
    }

    const { title, description } = req.body;

    const videoData = {
      id: videos.length + 1,
      title: title || 'Untitled',
      description: description || '',
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path
    };

    videos.push(videoData);

    res.json({
      message: 'Video uploaded successfully',
      video: videoData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /videos - list all videos
app.get('/videos', (req, res) => {
  res.json(videos);
});

// GET /video/:id - get a specific video
app.get('/video/:id', (req, res) => {
  const video = videos.find(v => v.id === parseInt(req.params.id));
  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }
  res.json(video);
});

// Error handling middleware for multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  res.status(400).json({ error: error.message });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

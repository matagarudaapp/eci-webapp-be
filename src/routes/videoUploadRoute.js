const { Router } = require("express");
const router = Router();
const videoUploadController = require("../controllers/videoUploadController");
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("multer");
const fs = require('fs');
const path = require('path');

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../temp-uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for video uploads with disk storage for large files
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const videoUpload = multer({ 
  storage: videoStorage,
  fileFilter: (req, file, cb) => {
    // Accept only video files
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024 // 5GB
  }
});

/**
 * @swagger
 * /videoUpload/validate:
 *   post:
 *     summary: Validate a video file without uploading to Google Drive
 *     tags:
 *       - videoUpload
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Video validated successfully
 *       400:
 *         description: Validation failed or no video provided
 *       500:
 *         description: Server error
 */
router.post(
  "/validate",
  authMiddleware.requireAuth,
  videoUpload.single("video"),
  videoUploadController.validateVideo_post
);

/**
 * @swagger
 * /videoUpload/upload:
 *   post:
 *     summary: Validate and upload a video to Google Drive
 *     tags:
 *       - videoUpload
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *               inspectorName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Video uploaded and processed successfully
 *       400:
 *         description: Validation failed or no video provided
 *       500:
 *         description: Server error
 */
router.post(
  "/upload",
  authMiddleware.requireAuth,
  videoUpload.single("video"),
  videoUploadController.uploadVideo_post
);

module.exports = router;
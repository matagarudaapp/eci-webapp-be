const fs = require('fs');
const { promisify } = require('util');
const ffmpeg = require('fluent-ffmpeg');
const Tesseract = require('tesseract.js');

class VideoValidationService {
  constructor() {
    // Configure accepted formats and resolutions
    this.acceptedFormats = ['mp4', 'avi', 'mov', 'mkv'];
    this.minResolution = { width: 640, height: 480 };
    this.maxResolution = { width: 1920, height: 1080 };
    this.maxFileSize = 5 * 1024 * 1024 * 1024; // 5GB
  }

  async validateVideo(file) {
    const validationResults = {
      isValid: true,
      errors: [],
      metadata: {}
    };

    try {
      // Check file size
      if (file.size > this.maxFileSize) {
        validationResults.isValid = false;
        validationResults.errors.push(`File size exceeds maximum allowed (${this.maxFileSize / (1024 * 1024 * 1024)}GB)`);
      }

      // Check file format
      const fileExtension = file.originalname.split('.').pop().toLowerCase();
      if (!this.acceptedFormats.includes(fileExtension)) {
        validationResults.isValid = false;
        validationResults.errors.push(`Invalid file format. Accepted formats: ${this.acceptedFormats.join(', ')}`);
      }

      // Get video metadata using ffmpeg
      const metadata = await this.getVideoMetadata(file.path);
      validationResults.metadata = metadata;

      // Check resolution
      if (metadata.resolution) {
        const { width, height } = metadata.resolution;
        
        if (width < this.minResolution.width || height < this.minResolution.height) {
          validationResults.isValid = false;
          validationResults.errors.push(`Video resolution too low. Minimum: ${this.minResolution.width}x${this.minResolution.height}`);
        }
        
        if (width > this.maxResolution.width || height > this.maxResolution.height) {
          validationResults.isValid = false;
          validationResults.errors.push(`Video resolution too high. Maximum: ${this.maxResolution.width}x${this.maxResolution.height}`);
        }
      } else {
        validationResults.isValid = false;
        validationResults.errors.push('Could not determine video resolution');
      }

      // Extract frames for OCR validation
      if (validationResults.isValid) {
        const frameValidation = await this.validateFrameInfo(file.path);
        if (!frameValidation.isValid) {
          validationResults.isValid = false;
          validationResults.errors = [...validationResults.errors, ...frameValidation.errors];
        }
      }

      return validationResults;
    } catch (error) {
      console.error('Video validation error:', error);
      validationResults.isValid = false;
      validationResults.errors.push(`Validation error: ${error.message}`);
      return validationResults;
    }
  }

  async getVideoMetadata(filePath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) return reject(err);
        
        const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
        if (!videoStream) return reject(new Error('No video stream found'));
        
        resolve({
          duration: metadata.format.duration, // in seconds
          format: metadata.format.format_name,
          resolution: {
            width: videoStream.width,
            height: videoStream.height
          },
          frameRate: eval(videoStream.r_frame_rate), // frames per second
          bitrate: videoStream.bit_rate
        });
      });
    });
  }

  async validateFrameInfo(filePath) {
    const result = {
      isValid: true,
      errors: []
    };

    try {
      // Extract a frame from ~5 seconds into the video
      const frameBuffer = await this.extractFrame(filePath, 5);
      
      // Perform OCR on the bottom portion of the frame
      const ocrResult = await this.performOCR(frameBuffer);
      
      // Validate timestamp format
      const hasValidTimestamp = this.validateTimestamp(ocrResult.text);
      if (!hasValidTimestamp) {
        result.isValid = false;
        result.errors.push('Invalid or missing timestamp format. Expected ISO format: YYYY-MM-DD HH:MM:SS');
      }
      
      // Validate coordinate format
      const hasValidCoordinates = this.validateCoordinates(ocrResult.text);
      if (!hasValidCoordinates) {
        result.isValid = false;
        result.errors.push('Invalid or missing coordinate format. Expected format: Lat: DD.DDDD, Long: DDD.DDDD');
      }
      
      return result;
    } catch (error) {
      console.error('Frame validation error:', error);
      result.isValid = false;
      result.errors.push(`Frame validation error: ${error.message}`);
      return result;
    }
  }

  async extractFrame(videoPath, timeInSeconds) {
    return new Promise((resolve, reject) => {
      const outputPath = `${videoPath}_frame.jpg`;
      
      ffmpeg(videoPath)
        .screenshots({
          timestamps: [timeInSeconds],
          filename: outputPath,
          count: 1
        })
        .on('end', () => {
          // Read the frame file and return as buffer
          fs.readFile(outputPath, (err, data) => {
            if (err) return reject(err);
            
            // Clean up the frame file
            fs.unlink(outputPath, (unlinkErr) => {
              if (unlinkErr) console.error('Error deleting frame file:', unlinkErr);
            });
            
            resolve(data);
          });
        })
        .on('error', (err) => reject(err));
    });
  }

  async performOCR(imageBuffer) {
    try {
      const result = await Tesseract.recognize(imageBuffer);
      return result;
    } catch (error) {
      throw new Error(`OCR processing failed: ${error.message}`);
    }
  }

  validateTimestamp(text) {
    // ISO date format regex (YYYY-MM-DD HH:MM:SS)
    const isoDateRegex = /\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/;
    return isoDateRegex.test(text);
  }

  validateCoordinates(text) {
    // Coordinate format regex
    // Looking for patterns like: Lat: -5.4520, Long: 105.4633
    const coordinateRegex = /-?\d+\.\d+.+?-?\d+\.\d+/;
    return coordinateRegex.test(text);
  }
}

module.exports = new VideoValidationService();
// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Add this to your .env file
    api_key: process.env.CLOUDINARY_API_KEY,       // Add this to your .env file
    api_secret: process.env.CLOUDINARY_API_SECRET  // Add this to your .env file
});

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'bookhive/books', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [
            {
                width: 800,
                height: 1000,
                crop: 'fill',
                quality: 'auto:good'
            }
        ]
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

module.exports = {
    cloudinary,
    upload
};
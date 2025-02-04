import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Initialize Express Router
const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Save in the correct "uploads" directory
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        const uniqueName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}${extname}`;
        cb(null, uniqueName);
    }
});

// File Type Validation
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG, JPG, PNG, and WEBP images are allowed."), false);
    }
};

// Multer Upload Config
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max file size
});

// Single Image Upload Middleware
const uploadSingleImage = upload.single("image");

// File Upload Route
router.post('/file', (req, res) => {
    uploadSingleImage(req, res, (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided." });
        }

        // Generate Image URL
        const imageUrl = `/uploads/${req.file.filename}`;

        return res.status(200).json({
            success: true,
            message: "Image uploaded successfully.",
            image: imageUrl
        });
    });
});

export default router;

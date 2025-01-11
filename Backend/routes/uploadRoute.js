import path from 'path';
import fs from 'fs';
import express from 'express';
import multer from 'multer';

// Ensure the uploads directory exists
const ensureUploadsDirectoryExists = () => {
    const uploadsDir = path.resolve("uploads");
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
};

ensureUploadsDirectoryExists();

// Initialize the Express router
const router = express.Router();

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve("uploads/")); // Absolute path for the destination
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${Date.now()}${extname}`);
    }
});

// File validation
const fileFilter = (req, file, cb) => {
    const fileTypes = /\.(jpeg|jpg|png|webp)$/; // File extensions
    const mimetypes = /image\/(jpeg|jpg|png|webp)$/; // MIME types

    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (fileTypes.test(extname) && mimetypes.test(mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG, JPG, PNG, and WEBP images are allowed."), false);
    }
};

// Multer configuration
const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

// Route for file upload
router.post('/file', (req, res) => {
    uploadSingleImage(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
            });
        }

        if (req.file) {
            return res.status(200).json({
                success: true,
                message: "Image uploaded successfully.",
                image: `/uploads/${path.basename(req.file.path)}`, // Provide relative path
            });
        }

        return res.status(400).json({
            success: false,
            message: "No image file provided.",
        });
    });
});

export default router;

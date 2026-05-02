import multer from "multer";
import { Router } from "express";
import path from "path";
import fs from "fs";
import { nanoid } from "nanoid";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename while keeping extension
        const ext = path.extname(file.originalname);
        const id = nanoid();
        cb(null, `${id}${ext}`);
    },
});

// Create multer instance with limits
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 500 * 1024 * 1024, // 500MB limit (allows large videos)
    },
});

export const uploadRouter = Router();

// Single file upload endpoint
uploadRouter.post("/", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    // Return the relative URL to access the file
    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({
        url: fileUrl,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size
    });
});

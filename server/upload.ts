import multer from "multer";
import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import { ENV } from "./_core/env";
import path from "path";
import fs from "fs";
import { nanoid } from "nanoid";

// Configure Cloudinary if URL is available
if (ENV.cloudinaryUrl) {
    cloudinary.config({
        cloudinary_url: ENV.cloudinaryUrl,
    });
    console.log("[Storage] Cloudinary initialized for external storage");
}

// Local storage fallback for development
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${nanoid()}${path.extname(file.originalname)}`),
});

const memoryStorage = multer.memoryStorage();

// Use memory storage if Cloudinary is configured, otherwise use disk
const storage = ENV.cloudinaryUrl ? memoryStorage : diskStorage;

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

export const uploadRouter = Router();

uploadRouter.post("/", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        if (ENV.cloudinaryUrl && req.file.buffer) {
            // Upload to Cloudinary using stream
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "aras-website",
                        resource_type: "auto",
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(req.file.buffer);
            });

            const cloudinaryResult = result as any;
            return res.json({
                url: cloudinaryResult.secure_url,
                filename: cloudinaryResult.public_id,
                mimetype: req.file.mimetype,
                size: req.file.size,
            });
        }

        // Fallback to local storage (Dev mode)
        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({
            url: fileUrl,
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size,
        });

    } catch (error) {
        console.error("[Storage] Upload error:", error);
        res.status(500).json({ error: "Failed to upload file to external storage" });
    }
});

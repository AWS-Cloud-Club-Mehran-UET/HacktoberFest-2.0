import cloudinary from "../config/cloudinary.config.js";
import report from "../models/report.model.js";

export const createReport = async (req, res) => {
    const { title, description, category, location } = req.body;

    if (!title || !description || !category || !location) {
        return res.status(400).json({ error: "Please enter all fields" });
    }

    try {
        const saveReport = async () => {
            const newreport = new report({
                title,
                description,
                category,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                photoUrl,
                createdBy: createdBy
            });
            await newreport.save();

            res.status(201).json({
                success: true,
                message: "report reported successfully",
                report: newreport,
            });
        };

        if (req.file) {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "image",
                    folder: "reports",
                    public_id: `${Date.now()}-${req.file.originalname}`,
                },
                async (error, result) => {
                    if (error) {
                        return res
                            .status(500)
                            .json({ error: "Cloudinary upload failed", details: error.message });
                    }
                    photoUrl = result.secure_url;
                    await savereport();
                }
            );
            streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        } else {
            await savereport();
        }
    } catch (error) {
        console.error("Error uploading report:", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
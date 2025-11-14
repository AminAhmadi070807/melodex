"use strict"

const path = require('path')
const musicModel = require('./music.model')
const response = require("../../../../helpers/response.helper");
const tagsModel = require("../../tags/tags.mp3.music.model");
const fileDeleter = require("../../../../utils/delete.file.util");

const allowedFormats = {
    music: ['.mp3', '.wav', '.ogg'],          // فرمت‌های صوتی
    poster: ['.jpg', '.png', '.jpeg', '.webp'], // فرمت تصویر پوستر
    covers: ['.jpg', '.jpeg', '.png', '.webp']  // فرمت تصاویر کاور
};

const validateFiles = async (files, allowed, folder, req) => {
    if (!files) return { ok: true };

    for (const file of files) {
        const ext = path.extname(file.filename.trim());
        if (!allowed.includes(ext)) {
            await deleteFileHandler(req);
            return { ok: false, message: `Invalid format: ${ext}` };
        }
    }

    return { ok: true };
};

const deleteFileHandler = async (req) => {
    const otherFields = ['posters', 'covers', 'musics'];
    for (const field of otherFields) {
        const files = req.files[field] || [];
        for (const file of files) {
            const fileDeleterResult = await fileDeleter(`public/uploads/${field}/`, file.filename.trim());
            if (fileDeleterResult.status !== 200) return { status: fileDeleterResult.status, message: fileDeleterResult.message };
        }
    }
}

module.exports.upload = async (req, res, next) => {
    try {
        const user = req.user;

        const { musics, posters, covers } = req.files

        if (!musics) {
            await deleteFileHandler(req);
            return response(res, 400, "upload music required");
        }

        req.body.poster = posters?.[0].filename.trim();
        req.body.route = musics?.[0]?.filename.trim()
        req.body.tags = req.body.tags.match(/#([\p{L}\p{N}_]+)/gu)

        let check = await validateFiles(musics, allowedFormats.music, "musics", req);
        if (!check.ok) return response(res, 422, check.message);

        check = await validateFiles(posters, allowedFormats.poster, "posters", req);
        if (!check.ok) return response(res, 422, check.message);

        check = await validateFiles(covers, allowedFormats.covers, "covers", req);
        if (!check.ok) return response(res, 422, check.message);

        const coversArray = []
        for (const file of covers) coversArray.push(file.filename.trim())

        const upload = await musicModel.create({
            ...req.body,
            user: user._id,
            covers: coversArray,
        })

        for (const tag of req.body.tags) {
            await tagsModel.findOneAndUpdate({ title: tag }, {
                $setOnInsert: { title: tag },
                $push: {
                    musics: upload._id
                }
            }, { new: true, upsert: true })
        }

        return response(res, 201, "Create new music successfully")
    }
    catch (error) {
        next(error)
    }
}
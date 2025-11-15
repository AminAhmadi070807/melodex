"use strict"

const path = require('path')
const musicModel = require('./music.model')
const response = require("../../../../helpers/response.helper");
const tagsModel = require("../../tags/tags.mp3.music.model");
const fileDeleter = require("../../../../utils/delete.file.util");

const allowedFormats = {
    music: ['.mp3', '.wav', '.ogg'],
    poster: ['.jpg', '.png', '.jpeg', '.webp'],
    covers: ['.jpg', '.jpeg', '.png', '.webp']
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
            console.log(musics)
            await deleteFileHandler(req);
            return response(res, 400, "upload music required");
        }

        req.body.poster = '/uploads' + '/posters/' + posters?.[0].filename.replace(/^\s+$/g, '');
        req.body.route = '/uploads' + '/musics/' + musics?.[0]?.filename.replace(/^\s+$/g, '')
        req.body.tags = req.body.tags.match(/#([\p{L}\p{N}_]+)/gu)

        let check = await validateFiles(musics, allowedFormats.music, "musics", req);
        if (!check.ok) return response(res, 422, check.message);

        check = await validateFiles(posters, allowedFormats.poster, "posters", req);
        if (!check.ok) return response(res, 422, check.message);

        check = await validateFiles(covers, allowedFormats.covers, "covers", req);
        if (!check.ok) return response(res, 422, check.message);

        const coversArray = []
        for (const file of covers) coversArray.push(`/uploads/covers/${file.filename.replace(/^\s+$/g, '')}`)

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

module.exports.remove = async (req, res, next) => {
    try {
        const user = req.user;
        const { id } = req.params;

        const accessToRemoveMusic = await musicModel.findOne({ _id: id, user: user._id }).lean()

        if (!accessToRemoveMusic || !user.role.includes("CONTENT-MODERATOR")) return response(res, 403, "You have no right to delete this music")

        const isExistMusic = await musicModel.findByIdAndDelete(id).select("route covers poster").lean()

        await fileDeleter('public', isExistMusic.route)
        await fileDeleter('public', isExistMusic.poster)
        for (const cover of isExistMusic.covers) await fileDeleter('public', cover)

        return response(res, 200, "Deleting music successfully")
    }
    catch (error) {
        next(error)
    }
}

module.exports.update = async (req, res, next) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const { musics, posters, covers } = req.files

        if (!musics) {
            await deleteFileHandler(req);
            return response(res, 400, "upload music required");
        }

        req.body.poster = '/uploads' + '/posters/' + posters?.[0].filename.replace(/^\s+$/g, '');
        req.body.route = '/uploads' + '/musics/' + musics?.[0]?.filename.replace(/^\s+$/g, '')
        req.body.tags = req.body.tags.match(/#([\p{L}\p{N}_]+)/gu)

        const removeMusic = await musicModel.findOneAndDelete({ _id: id, user: user._id }).select("route covers poster").lean()

        if (!removeMusic || !user.role.includes("CONTENT-MODERATOR")) return response(res, 403, "You have no right to delete this music")

        let check = await validateFiles(musics, allowedFormats.music, "musics", req);
        if (!check.ok) return response(res, 422, check.message);

        check = await validateFiles(posters, allowedFormats.poster, "posters", req);
        if (!check.ok) return response(res, 422, check.message);

        check = await validateFiles(covers, allowedFormats.covers, "covers", req);
        if (!check.ok) return response(res, 422, check.message);

        const coversArray = []
        for (const file of covers) coversArray.push(`/uploads/covers/${file.filename.replace(/^\s+$/g, '')}`)

        await fileDeleter('public', removeMusic.route)
        await fileDeleter('public', removeMusic.poster)
        for (const cover of removeMusic.covers) await fileDeleter('public', cover)

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

        return response(res, 201, "Update music successfully")
    }
    catch (error) {
        next(error)
    }
}
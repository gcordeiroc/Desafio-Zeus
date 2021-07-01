const fs = require('fs').promises;
const path = require('path');

const Files = require('../models/Files');

module.exports = {
    create: async (user, { originalname: name, mimetype, buffer }) => {
        let fileCreated = new Files({ user, name, mimetype, buffer });

        return await fileCreated.save().catch(Promise.reject);
    },

    getFile: async (req, res) => {
        let { download } = req.query;

        let sender = async () => {
            res.set('Content-Type', 'image/png');
            res.end(await fs.readFile(path.resolve(__dirname, '..', 'utils', 'user.png')));
        }

        try { await Files.findById(req.params.id).then(async file => {
            if(!file) return await sender();

            res.set('Content-Type', file.mimetype);

            if(download) res.set('Content-disposition', 'attachment; filename=' + file.name);

            return res.end(file.buffer.buffer);
        })} catch { return await sender() }
    },

    remove: async (req, res) => {
        Files.findById(req.params.id).then(file => {
            if(!file) return res.files.error('notFound');
            if(file.user != req.users.id) return res.files.error('unauthorized');

            Files.findByIdAndDelete(req.params.id).then(() => res.status(200).json({ id: file._id })).catch(res.files.error);
        }).catch(res.files.error);
    },

    delete: async (id) => {
        return await Files.findByIdAndDelete(id).catch(Promise.reject);
    }
}
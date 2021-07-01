const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Users = require('../models/Users');

const List = require('../repositories/list');

const filesController = require('./files');

/* Secret */
const { SECRET } = process.env;

module.exports = {
    create: async (req, res) => {
        let user = new Users({ name, email, password } = req.body);

        user.save().then(async user => {
            if(req.file) filesController.create(user._id, req.file).then(file => {
                Users.findByIdAndUpdate(user._id, { image: file._id }, { new: true }).then(res.users.created).catch(res.users.error);
            }).catch(res.files.error);
            else res.users.created(user);
        }).catch(res.users.error);
    },

    getOne: async (req, res) => {
        if(req.params.id != req.users.id) return res.files.error('unauthorized');

        Users.findById(req.params.id).populate('Purchases').then(user => {
            if(!user) return res.users.error('notFound');

            res.users.show(user);
        }).catch(res.users.error);
    },

    getMany: async (req, res) => List(Users, req.query).then(res.users.many).catch(res.users.error),
    
    update: async (req, res) => {
        if(req.params.id != req.users.id) return res.files.error('unauthorized');

        let data = req.body;
        let newUser = true;

        if(req.file) {
            let isError = false;
            let image = await filesController.create(req.params.id, req.file).catch(err => isError = err);
            
            if(isError) return res.files.error(isError);
            data[image] = image._id;

            newUser = false;
        }

        Users.findByIdAndUpdate(
            req.params.id,
            data,
            { new: newUser }
        ).then(async user => {
            if(!user) return res.users.error('notFound');
            
            if(!newUser) {
                await filesController.delete(user.image);
                user.image = data.image;
            }

            for (element in data) {
                user[element] = data[element];
            }

            res.users.show(user);
        }).catch(async err => {
            if(!newUser) await filesController.delete(data.image).catch();

            res.users.error(err);
        });
    },

    delete: async (req, res) => {
        if(req.params.id != req.users.id) return res.files.error('unauthorized');
        
        Users.findByIdAndDelete(req.params.id).then(user => {
            if(!user) return res.users.error('notFound');

            res.users.show(user);
        }).catch(res.users.error);
    },

    login: async (req, res) => {
        let { email, password } = req.body;
        if(!email || !password) return res.users.error('unauthorized');

        Users.findOne({ email }).then(async user => {
            if(!user) return res.users.error('notFound');
            if(!await bcrypt.compare(password, user.password)) return res.users.error({ status: 401, key: 'incorrectPassword' });
            return res.users.login({
                user,
                token: jwt.sign({ id: user._id }, SECRET)
            })
        }).catch(res.users.error);
    }
};
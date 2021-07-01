const Purchases = require('../models/Purchases');
const Users = require('../models/Users');

const List = require('../repositories/list');

module.exports = {
    create: async (req, res) => {
        let { title, description, weight, value } = req.body;
        const user = req.users.id;
        
        let purchase = new Purchases({ user, title, description, weight, value });

        purchase.save().then(async purchase => {
            Users.findByIdAndUpdate(purchase.user, { '$push': { 'purchases': purchase._id } }).then(() => res.purchases.created(purchase)).catch(res.users.error);
        }).catch(res.purchases.error);
    },

    getOne: async (req, res) => Purchases.findById(req.params.id).then(async purchase => {
        if(req.users.id != purchase.user) return res.purchases.error('unauthorized');

        return res.purchases.show(purchase);
    }).catch(res.purchases.error),

    getMany: async (req, res) => {
        let { pagination, sort, filter = {}, populate } = req.query;

        /*
            Ensuring not to list purchases from other users
        */
        filter.qField = 'user';
        filter.q = req.users.id.toString();

        List(Purchases, { pagination, sort, filter, populate }, 'user').then(res.purchases.many).catch(res.purchases.error);
    },

    update: async (req, res) => {
        const { id } = req.params;

        Purchases.findById(id).then(async purchase => {
            if(!purchase) return res.purchases.error('notFound');
            if(purchase.user != req.users.id) return res.purchases.error('unauthorized');

            Purchases.findByIdAndUpdate(id, { title, description, weight, value } = req.body, { new: true }).then(res.purchases.show).catch(res.purchases.error);
        }).catch(res.purchases.error);
    },

    delete: async (req, res) => {
        const { id } = req.params;

        Purchases.findById(id).then(async purchase => {
            if(!purchase) return res.purchases.error('notFound');
            if(purchase.user != req.users.id) return res.purchases.error('unauthorized');
            
            Purchases.findByIdAndDelete(id).then(() => Users.findByIdAndUpdate(purchase.user, { '$pull': { 'purchases': purchase._id } }).then(() => res.status(200).json({ id: purchase._id })).catch(res.users.error)).catch(res.purchases.error);
        }).catch(res.purchases.error);
    }
};
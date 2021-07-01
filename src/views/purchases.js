const labels = require('../labels/index');

const { LANGUAGE } = process.env;

function error(res) {
    return (err = {}) => {
        if (err.errors) {
            let keys = Object.keys(err.errors);
            let errors = keys.map(key => err.errors[key]);
            res.status(400).json({message: errors[0].message, errors})
        } else if (err.toString() === "TypeError: Cannot destructure property '_id' of 'object null' as it is null." || err === 'notFound' || (err.reason && err.reason.toString() === 'Error: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters'))
            res.status(404).json({message: labels[(labels[res.language])? res.language: LANGUAGE || 'en-US']?.['notFoundPurchase']});
        else if (labels['pt-BR'][err.key])
            res.status(err.status).json({message: labels[(labels[res.language])? res.language: LANGUAGE || 'en-US']?.[err.key]});
        else if(err === 'unauthorized')
            res.status(401).json({message: labels[(labels[res.language])? res.language: LANGUAGE || 'en-US']?.['unauthorized']});
        else
            res.status(500).json({message: labels[(labels[res.language])? res.language: LANGUAGE || 'en-US']?.['error']});
    };
}

function one({ _id: id, user, title, description, weight, value, createdAt, updatedAt }) {
    return { data: { id, user, title, description, weight, value, createdAt, updatedAt } }
}

function many({ data, total }) {
    return {
        data: data.map(purchases => one(purchases).data),
        total
    }
}

module.exports = (req, res, next) => {

    res.purchases = {
        error: error(res),
        created: (purchases) => res.status(201).json(one(purchases)),
        show: (purchases) => res.status(200).json(one(purchases)),
        many: (data) => res.status(200).json(many(data))
    }

    next();
};
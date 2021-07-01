const labels = require('../labels/index');

const { LANGUAGE } = process.env;

const HOST = (process.env.SELF_HOST.charAt(process.env.SELF_HOST.length - 1) != '/')? process.env.SELF_HOST + '/': process.env.SELF_HOST;


function error(res) {
    return (err = {}) => {
        if (err.code === 11000)
            res.status(400).json({message: labels[(labels[res.language])? res.language: LANGUAGE || 'en-US']?.['userExists']});
        else if (err.errors) {
            let keys = Object.keys(err.errors);
            let errors = keys.map(key => err.errors[key]);
            res.status(400).json({message: errors[0].message, errors})
        } else if (err.toString() === "TypeError: Cannot destructure property '_id' of 'object null' as it is null." || err === 'notFound' || (err.reason && err.reason.toString() === 'Error: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters'))
            res.status(404).json({message: labels[(labels[res.language])? res.language: LANGUAGE || 'en-US']?.['notFoundUser']});
        else if (labels['pt-BR'][err.key])
            res.status(err.status).json({message: labels[(labels[res.language])? res.language: LANGUAGE || 'en-US']?.[err.key]});
        else if(err === 'unauthorized')
            res.status(401).json({message: labels[(labels[res.language])? res.language: LANGUAGE || 'en-US']?.['unauthorized']});
        else
            res.status(500).json({message: labels[(labels[res.language])? res.language: LANGUAGE || 'en-US']?.['error']});
    };
}

function one({ _id: id, name, email, image, purchases, createdAt, updatedAt }) {
    return { data: { id, name, email, image: { id: image, url: `${HOST}files/${image}` }, purchases, createdAt, updatedAt } };
}

function many({ data, total }) {
    return {
        data: data.map(user => one(user).data),
        total
    }
}

function login({user, token}) {
    return {
        user: one(user),
        token
    }
}


module.exports = (req, res, next) => {

    res.users = {
        error: error(res),
        login: (data) => res.status(200).json(login(data)),
        created: (user) => res.status(201).json(one(user)),
        show: (user) => res.status(200).json(one(user)),
        many: (data) => res.status(200).json(many(data))
    }

    next();
};
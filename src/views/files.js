const labels = require('../labels/index');

const { LANGUAGE } = process.env;

function error(res) {
    return (err = {}) => {
        if(err.toString() === "TypeError: Cannot destructure property '_id' of 'object null' as it is null." || err === 'notFound' || (err.reason && err.reason.toString() === 'Error: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters')) res.status(404).json({ message: labels[(labels[res.language])? res.language: LANGUAGE || 'en-US']?.['notFoundFile'] });
        else if(err === 'unauthorized') res.status(401).json({message: labels[(labels[res.language])? res.language: LANGUAGE || 'en-US']?.['unauthorized']});
        else res.status(500).json({message: labels[(labels[res.language])? res.language: LANGUAGE || 'en-US']?.['error']});
    };
}

module.exports = (req, res, next) => {

    res.files = {
        error: error(res),
    }

    next();
};

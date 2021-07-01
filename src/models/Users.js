const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Files = require('./Files');
const Purchases = require('./Purchases');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: mongoose.Types.ObjectId,
        ref: 'Files',
    },
    purchases: [{
        type: mongoose.Types.ObjectId,
        ref: 'Purchases'
    }]
}, { timestamps: true });

UserSchema.index({ email: 1 }, { unique: true });

UserSchema.pre('save', async function (next) {
    let { password } = this;
    this.password = await bcrypt.hash(password, bcrypt.genSaltSync(10)).catch(e => next(e));

    next();
});

UserSchema.pre('findOneAndUpdate', async function (next) {
    let { password } = this._update;

    if(password) this._update.password = await bcrypt.hash(password, bcrypt.genSaltSync(10)).catch(e => next(e));

    next();
});

UserSchema.post('findOneAndDelete', async function (user, next) {
    await Files.deleteOne({ user: user._id });
    await Purchases.deleteMany({ user: user._id });

    next();
})

module.exports = mongoose.model('Users', UserSchema);
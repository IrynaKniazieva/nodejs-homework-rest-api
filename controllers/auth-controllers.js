const { ctrlWrapper } = require("../utils");

const {User} = require("../models/user");

const { HttpError } = require("../helpers");

const register = async (req, res) => {
    const result = await User.create(req.body);

    res.status(201).json({
        name: result.name,
        email: result.email,
    })
}

module.export = {
    register: ctrlWrapper(register),
}
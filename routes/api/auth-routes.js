const express = require("express");

// const ctrl = require("../../controllers/auth-controllers")

const {validateBody} = require("../../utils");

 const {schemas} = require("../../models/user");

const router = express.Router();

// singUp
router.post("/register", validateBody(schemas.registerSchema))

module.exports = router;
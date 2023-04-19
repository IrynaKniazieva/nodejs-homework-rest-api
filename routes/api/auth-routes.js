const express = require("express");

const ctrl = require("../../controllers/auth-controllers");

const {validateBody} = require("../../utils");

const {authenticate} = require("../../middlewares");

 const {registerSchema, loginSchema } = require("../../utils/validation/userValidationSchemas")

const router = express.Router();

router.post("/register", validateBody(registerSchema), ctrl.register);

router.post("/login", validateBody(loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent)

router.post("/logout", authenticate, ctrl.logout);

module.exports = router;
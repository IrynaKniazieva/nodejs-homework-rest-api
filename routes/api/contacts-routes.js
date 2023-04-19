const express = require("express");

const ctrl = require("../../controllers/contacts-controllers");

const { validateBody } = require("../../utils");

const { isValidId, authenticate } = require("../../middlewares");

const {addSchema, updateFavoriteSchema} = require("../../utils/validation/contactValidationSchemas");

const router = express.Router();

router.get("/", authenticate, ctrl.getAllContacts);

router.get("/:id", authenticate, isValidId, ctrl.getContactById);

router.post("/", authenticate, validateBody(addSchema), ctrl.addNewContact);

router.delete("/:id", authenticate, isValidId, ctrl.deleteContactById);

router.put("/:id", authenticate, isValidId, validateBody(addSchema), ctrl.updateOneContact);

router.patch("/:id/favorite", validateBody(updateFavoriteSchema), ctrl.updateFavorite);

module.exports = router;

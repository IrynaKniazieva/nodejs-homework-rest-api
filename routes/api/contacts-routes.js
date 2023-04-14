const express = require("express");

const ctrl = require("../../controllers/contacts-controllers");

const { validateBody } = require("../../utils");

const {isValidId} = require("../../middlewares");

// const schemas  = require("../../utils/contactValidationSchemas")

const { schemas } = require("../../models/contact");

const router = express.Router();

router.get("/", ctrl.getAllContacts);

router.get("/:id", isValidId, ctrl.getContactById);

router.post("/", validateBody(schemas.addSchema), ctrl.addNewContact);

router.delete("/:id", isValidId, ctrl.deleteContactById);

router.put("/:id", isValidId, validateBody(schemas.addSchema), ctrl.updateOneContact);

router.patch(
  "/:id/favorite",
  validateBody(schemas.updateFavoriteSchema),
  ctrl.updateFavorite
);

module.exports = router;

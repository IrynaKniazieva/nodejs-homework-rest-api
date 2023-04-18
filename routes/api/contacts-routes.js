const express = require("express");

const ctrl = require("../../controllers/contacts-controllers");

const { validateBody } = require("../../utils");

const { isValidId, authenticate } = require("../../middlewares");

const {
  addSchema,
  updateFavoriteSchema,
} = require("../../utils/validation/contactValidationSchemas");

// const { schemas } = require("../../models/contact");

const router = express.Router();

router.get("/", authenticate, ctrl.getAllContacts);

router.get("/:id", authenticate, isValidId, ctrl.getContactById);

router.post("/", authenticate, validateBody(addSchema), ctrl.addNewContact);

// router.post("/", authenticate, validateBody(schemas.addSchema), ctrl.addNewContact);

router.delete("/:id", authenticate, isValidId, ctrl.deleteContactById);

router.put(
  "/:id",
  authenticate,
  isValidId,
  validateBody(addSchema),
  ctrl.updateOneContact
);

// router.put("/:id", authenticate, isValidId, validateBody(schemas.addSchema), ctrl.updateOneContact);

router.patch(
  "/:id/favorite",
  validateBody(updateFavoriteSchema),
  ctrl.updateFavorite
);

// router.patch(
//   "/:id/favorite",
//   validateBody(schemas.updateFavoriteSchema),
//   ctrl.updateFavorite
// );

module.exports = router;

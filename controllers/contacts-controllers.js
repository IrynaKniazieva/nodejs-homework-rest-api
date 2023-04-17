const { Contact } = require("../models/contact");

const { ctrlWrapper } = require("../utils");

const { HttpError } = require("../helpers");

const getAllContacts = async (req, res) => {
    const {_id: owner} = req.user;
    console.log(req.query)
    const {page = 1, limit = 10} = req.query;
    const skip = (page - 1) * limit;
   
  const result = await Contact.find({owner}, "-createdAt -updatedAt", {skip, limit}).populate("owner", "name email");
  res.json(result);
};

const getContactById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json(result);
};

const addNewContact = async (req, res) => {
  const {_id: owner} = req.user;
    const result = await Contact.create({...req.body, owner});
  res.status(201).json(result);
};

const deleteContactById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json({ message: "contact deleted" });
};

const updateOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json(result);
};

const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json(result);
};
module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  addNewContact: ctrlWrapper(addNewContact),
  deleteContactById: ctrlWrapper(deleteContactById),
  updateOneContact: ctrlWrapper(updateOneContact),
  updateFavorite: ctrlWrapper(updateFavorite),
};

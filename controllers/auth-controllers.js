const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const jimp = require("jimp");
const {nanoid} = require("nanoid");

const { ctrlWrapper } = require("../utils");

const { User } = require("../models/user");

const { HttpError, sendEmail } = require("../helpers");
const { date } = require("joi");

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();


  const result = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/veryfy/${verificationToken}">Clik verufy email</a>`
  }

  await sendEmail(verifyEmail);

  res.status(201).json({
    email: result.email,
    subscription: result.subscription,
  });
};

const verify = async(req, res)=> {
  const {verificationToken} = req.params;
  const user = await User.findOne({verificationToken});
  if(!user) {
      throw HttpError(404, "Email not found");
  }

  await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: ""});
  
  res.json({
      message: "Verification email sent"
  })
}

const resendVerifyEmail = async(req, res)=> {
  const {email} = req.body;
  const user = await User.findOne({email});
  if(!user){
      throw HttpError(404, "Email not found");
  }
  if(user.verify){
      throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click verify email</a>`
  };

  await sendEmail(verifyEmail);

  res.json({
      message: "Email resend success"
  })
}

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new HttpError(401, "Email or password is wrong");
  }

  if(!user.verify) {
    throw HttpError(401, "Email not verify");
}

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    email,
    subscription: user.subscription,
  });
};

const getCurrent = async (req, res) => {
  const { email } = req.user;
  const user = await User.findOne({ email });

  res.json({
    email,
    subscription: user.subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.sendStatus(204).end();
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, filename } = req.file;
  const avatarName = `${_id}_${filename}`;
  const resultUpload = path.join(avatarsDir, avatarName);

  const image = await jimp.read(tempUpload);
  await image.resize(250, jimp.AUTO);
  await image.writeAsync(tempUpload);

  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", avatarName);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};

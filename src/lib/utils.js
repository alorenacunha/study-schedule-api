function comparePassword(eventPassword, userPassword) {
  const bcrypt = require("bcryptjs");
  return bcrypt.compare(eventPassword, userPassword);
}

function signToken(user) {
  var jwt = require("jsonwebtoken");
  var { JWT_SECRET } = require("../../secrets.json");
  console.log({ user, JWT_SECRET });
  var token = jwt.sign({ email: user.userId, name: user.name }, JWT_SECRET);
  return token;
}

function verifyToken(authorization) {
  if (!authorization) return false;
  const token = authorization.replace("Bearer ", "");
  var jwt = require("jsonwebtoken");
  var { JWT_SECRET } = require("../../secrets.json");

  var isValid = jwt.verify(token, JWT_SECRET);
  console.log({ isValid });
  return isValid;
}

module.exports = {
  comparePassword,
  signToken,
  verifyToken,
};

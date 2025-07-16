const jwt = require('jsonwebtoken');


const JWT = process.env.JWT_SECRET
console.log(JWT)

const generateToken = (payload, expiresIn = "1h") => {
  const token = jwt.sign( payload, JWT, {
    expiresIn
  });

  return token
};

module.exports = generateToken;

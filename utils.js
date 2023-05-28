import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
    process.env.SECRET_KEY,
    { expiresIn: '15d' }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
      if (err) {
        console.log('Invalid Token');
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        console.log("valid token")
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};
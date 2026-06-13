import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const authToken = jwt.sign(
    { userId: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );

  res.cookie('jwt', authToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;
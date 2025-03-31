import jwt from "jsonwebtoken";


export const generateTokenAndSetCookie = (res, userId) => {
  console.log("generateTokenAndSetCookie " ,userId,"process.env.SECRET_KEY ",process.env.SECRET_KEY);
  const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
  console.log("token : ",token);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:"strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token ;
};

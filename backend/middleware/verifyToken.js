import jwt from "jsonwebtoken";


export const verifyToken = (req,res,next)=>{

    const token = req.cookies.token;
    console.log("token",token);
    if(!token) return res.status(401).json({success:false,message:"Unauthorized"});   
    try{
    const decoded = jwt.verify(token,process.env.SECRET_KEY);
        req.userId = decoded.userId
        next();
    }catch(err){
        console.log("Error in verify Token ",err);
        return res.status(500).json({success:false,message:"server error"});
    }
}
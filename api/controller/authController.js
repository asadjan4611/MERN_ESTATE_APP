const bcrypt = require('bcrypt');
const UserModel= require("../model/usermodel.js");
const dotenv = require("dotenv");
const { errorHandler } = require('../utilis/arrow.js');
dotenv.config();
const jwt = require('jsonwebtoken');

 const authController = async (req, res,next) => {
   
        
        const { username, email, password } = req.body;
           
        const hasedpassword = await bcrypt.hash(password,10);


        try {
           const newUser = await UserModel.create({
                    username,
                    email,
                    password:hasedpassword // Storing plain password - ONLY FOR TESTING
                });
        newUser.save();

         return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        }); 
        } catch (error) {
            next(error)
        }};

 const authSignInController = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
   

    // 2. Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(errorHandler(401, "Invalid password"));
    }
    

    // 3. Generate JWT token
    const token = jwt.sign({ id: user._id },process.env.JWT_SECERT, {
      expiresIn: "1h", // Optional: Token expiry
    });
    
  console.log(token);
   // 4. Set cookie and send response
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure:false,
       // secure: process.env.NODE_ENV === "production", // HTTPS in production
        sameSite: "lax", // Prevent CSRF
      })
      .status(200)
      .json({
        success: true,
        user: {
          _id: user._id,
          email: user.email,
          username:user.username
        },
      }
    );
  } catch (err) {
    next(errorHandler(500, "Internal server error"));
  }
};


const  googleContoller= async(req,res,next) =>{
          try {
            const user = await UserModel.findOne({ email :req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id },process.env.JWT_SECERT, {
      expiresIn: "1h", // Optional: Token expiry
    });
    
  console.log(token);
  const { password: pass, ...rest } = user._doc;
   // 4. Set cookie and send response
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // HTTPS in production
        sameSite: "strict", // Prevent CSRF
      })
      .status(200)
      .json(rest);
    }else{
      const generatedPassowrd = Math.random().toString(36).slice(-8) +Math.random().toString(36).slice(-8);
      const hashedpassword =await  bcrypt.hash(generatedPassowrd,10);
      const newUser = await  UserModel.create({
        email :req.body.email,
        username :req.body.name.split("").join("").toLowerCase() + Math.random().toString(36).slice(-4),
        password:hashedpassword,
        avatar:req.body.photo
      });
       newUser.save();
     
        const token = jwt.sign({ id: newUser._id },process.env.JWT_SECERT, {
      expiresIn: "1h", // Optional: Token expiry
    });
    const { password: pass, ...rest } = newUser._doc;
    
  console.log(token);
   // 4. Set cookie and send response
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // HTTPS in production
        sameSite: "strict", // Prevent CSRF
      })
      .status(200)
      .json(rest)
    }
   
          } catch (error) {
            next(errorHandler(500, "Google authentication failed: " + error.message)); 
          }
}

const authSignOutController = async (req, res, next) => {
   console.log("logout ")
  try {
    res.clearCookie('access_token')
    .status(200).json("user  signout");
       console.log("user signout successfully");
  } catch (error) {
    return next(errorHandler(error.message));
  }
};

module.exports ={authController,authSignInController,googleContoller,authSignOutController}
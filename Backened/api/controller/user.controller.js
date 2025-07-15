
const listeningModel = require("../model/listeningModel");
const usermodel = require("../model/usermodel");
const { errorHandler } = require("../utilis/arrow");
const bcrypt = require('bcrypt');

const test = (req, res) => {
  res.json({
    'message': "hello json"
  });
};

const update = async(req, res,next) => {
 
  if (req.user.id !== req.params.id) {
    return next(errorHandler(400,'you can update only your account'))
  }

  try {
    if (req.body.password) {
      req.body.password =await  bcrypt.hash(req.body.password,10);
    }

   
   
    const updatedUser = await usermodel.findByIdAndUpdate(
       req.params.id,
      {
        $set :{
          username :req.body.username,
          email: req.body.email,
          password :req.body.password,
          avatar:req.body.avatar
        }
      },{new:true}
    );
  

    if(!updatedUser){
      return next(errorHandler(400,'user that is udated is not found '))
    }

  
     
    const {password, ...rest} = updatedUser._doc;
    res.status(200).json(rest);
  
   
  } catch (error) {
     return next(errorHandler(500,error.message)) 
  }
};

const deleteUser = async(req, res,next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(400,'you can update only your account'))
  }
   
  try {
    await usermodel.findOneAndDelete(req.params.id);
    res.clearCookie('access_token')
       .status(200)
       .json({ success: true, message: 'User deleted successfully' });
    res.status(200).json("User deleletd successfully");
 
  } catch (error) {
    return next(errorHandler(500,error.message))
  }
  
  
};




module.exports = { test ,update,deleteUser };  // CommonJS export
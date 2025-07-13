
const listeningModel = require("../model/listeningModel");
const { errorHandler } = require("../utilis/arrow");


const createListening =async (req,res,next) => {
    

    try {
       
       const listening = await listeningModel.create(req.body);


       res.status(201).json(listening);
       
    } catch (error) {
        return next(errorHandler(error.message));
    }
}

const deleteListening =async (req,res,next) => {
      
    const listening = await listeningModel.findById(req.params.id);
    if(!listening){
        return  next(errorHandler(400,"Listening is not found"));
    }

    if(req.user.id !== listening.useRef){
        return next(errorHandler(402,"You can only delete your own account"))
    }
    
    try {
     await listeningModel.findByIdAndDelete(req.params.id);
     console.log("Every thing is correctly happened");
     res.status(200).json("Deleted successfully")
    } catch (error) {
        return next(errorHandler(500,error.message));
    }
}

const updateListening =async (req,res,next) => {
      console.log("welcome at update function");
    const listening = await listeningModel.findById(req.params.id);
    if(!listening){
        return  next(errorHandler(400,"Listening is not found"));
    }
      console.log("welcome after user finf sucessfully");
    //console.log("User from token:", req.user);
    if(req.user.id !== listening.useRef.toString()){
        return next(errorHandler(402,"You can only Upadte your own account"))
    }
      console.log("welcome after user finf sucessfully");
    
    try {
    const updateListening =  await listeningModel.findByIdAndUpdate(
        req.params.id,
        
         req.body
        ,{new:true}
     );

     if(!updateListening){
          return next(errorHandler(500,"update listening is not found"))
     }
     res.status(200).json(updateListening);
     console.log("Every thing is correctly happened");
    } catch (error) {
        return next(errorHandler(500,error.message));
    }
}

const getListening =async (req,res,next) => {
        console.log("welcome");
if (req.params.id === req.user.id) {
  try {
    const listening = await listeningModel.find({useRef:req.params.id});
    res.status(200).json(listening);
        console.log("everything is correct at end");
       
        } catch (error) {
     return  next(errorHandler(402,"Your error is ",error)); 
  }
}else{
   return  next(errorHandler(401,"You can only views your own list not othering"));  
}

}

const getListeningData =async (req,res,next) => {
       
     try {
         const listening = await listeningModel.findById(req.params.id);
    if (!listening) {
        return next(errorHandler(400,'listening is not found'));
    }
    res.status(200).json(listening)
 
     } catch (error) {
         return next(errorHandler(400,error));
     }
   
}


 module.exports ={deleteListening, createListening,updateListening,getListening,getListeningData }

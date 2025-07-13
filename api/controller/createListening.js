
const listeningModel = require("../model/listeningModel");
const usermodel = require("../model/usermodel");
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


const getUser = async (req,res,next)=>{
    console.log("Welcome at getUser function");
    const user = req.params.id;
    try {
       if (!user) {
        return  next(errorHandler(402,"User is not found"));
    }
    const data   = await usermodel.findById(user);
     if (!data) {
        return  next(errorHandler(402,"Data is not found"));
    }
    const {password: pass,...rest} = data._doc;
    res.status(200).json(rest) 
    } catch (error) {
     next(errorHandler(500,"error is not found"));   
    }
    
}



const gettingListening = async (req,res,next)=>{
    console.log("welcome at getListning functions")
    try {
         const limit = parseInt(req.query.limit) || 9;
    const  startIndex = parseInt(req.query.startIndex) ||0;
    let offer = req.query.offer;

    if (offer === undefined|| offer === 'false') {
        offer = {$in:[false,true]}
    }
   
    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
        furnished = {$in:[false,true]}
    }

     let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
        parking = {$in:[false,true]}
    }
    
     let type = req.query.type;

    if (type === undefined || type === 'false') {
        type = {$in:['Sale',"Rent"]}
    }
     let searchTerm = req.query.searchTerm || '';
     let sort = req.query.sort || 'createdAt';
     let order = req.query.order || 'desc';
     console.log({
  offer,
  furnished,
  parking,
  type,
  searchTerm,
});

     const listeningsdata = await listeningModel.find({
        name:{$regex:searchTerm,$options:"i"},
        offer,
        furnished,
        parking,
        type,
        
     }).sort({[sort]:order}).limit(limit).skip(startIndex);
   //const listeningsdata = await listeningModel.find();
    console.log("Matched listings:", listeningsdata.length);
  console.log("Matched listings:", listeningsdata )
     res.status(200).json(listeningsdata)
    } catch (error) {
       return next(errorHandler(500,error)); 
    }
     
}



 module.exports ={deleteListening, createListening,updateListening,getListening,getListeningData,gettingListening,getUser }

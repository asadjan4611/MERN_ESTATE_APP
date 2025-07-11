const listeningModel = require("../model/listeningModel");
const { errorHandler } = require("../utilis/arrow");


const createListening =async (req,res,next) => {
    

    try {
        console.log("okay");
       const listening = await listeningModel.create(req.body);
        console.log("okay after model");

       res.status(201).json(listening);
        console.log("okay after response");
       
    } catch (error) {
        return next(errorHandler(error.message));
    }
}

 module.exports = {createListening}

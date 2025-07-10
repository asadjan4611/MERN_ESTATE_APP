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

 module.exports = {createListening}

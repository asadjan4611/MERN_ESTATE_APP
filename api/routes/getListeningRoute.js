const express  = require("express");
const { verifyToken } = require("../utilis/verifyUser");
const  {deleteListening,getListening,updateListening}  = require("../controller/createListening");



const getListeningRoute = express.Router();


getListeningRoute.get("/listening/:id",verifyToken,getListening);
getListeningRoute.delete("/deleteListening/:id",verifyToken,deleteListening);
getListeningRoute.put("/updateListening/:id",verifyToken,updateListening);


module.exports ={ getListeningRoute }
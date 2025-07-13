const express  = require("express");
const { verifyToken } = require("../utilis/verifyUser");
const  {deleteListening,getListening,updateListening,getListeningData}  = require("../controller/createListening");



const getListeningRoute = express.Router();


getListeningRoute.get("/listening/:id",verifyToken,getListening);
getListeningRoute.delete("/deleteListening/:id",verifyToken,deleteListening);
getListeningRoute.put("/updateListening/:id",verifyToken,updateListening);
getListeningRoute.get("/getListeningData/:id",getListeningData);

module.exports ={ getListeningRoute }
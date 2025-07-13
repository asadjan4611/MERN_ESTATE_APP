const express  = require("express");
const { verifyToken } = require("../utilis/verifyUser");
const  {deleteListening,getListening,updateListening,getListeningData,gettingListening,getUser}  = require("../controller/createListening");



const getListeningRoute = express.Router();


getListeningRoute.get("/listening/:id",verifyToken,getListening);
getListeningRoute.delete("/deleteListening/:id",verifyToken,deleteListening);
getListeningRoute.put("/updateListening/:id",verifyToken,updateListening);
getListeningRoute.get("/getListeningData/:id",getListeningData);
getListeningRoute.get("/gettingListening",verifyToken,gettingListening);
 getListeningRoute.get("/:id",verifyToken,getUser);
module.exports ={ getListeningRoute }
const express = require("express");
const { getListening,test,update ,deleteUser} = require("../controller/user.controller.js");
const { verifyToken } = require("../utilis/verifyUser.js");
const testrouter = express.Router();

testrouter.get("/test",test);
testrouter.post("/update/:id",verifyToken ,update);
testrouter.delete("/delete/:id",verifyToken ,deleteUser);
// testrouter.get("/listening/:id",verifyToken,getListening);
module.exports = testrouter;
const express = require("express");
const { test,update } = require("../controller/user.controller.js");
const { verifyToken } = require("../utilis/verifyUser.js");
const testrouter = express.Router();

testrouter.get("/test",test);
testrouter.post("/update/:id" ,update);


module.exports = testrouter;
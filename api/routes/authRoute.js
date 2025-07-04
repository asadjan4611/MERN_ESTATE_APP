const express = require("express");
const { authController,authSignInController,googleContoller } = require("../controller/authController");

const authRouter = express.Router();

authRouter.post("/signup",authController);
authRouter.post("/signin",authSignInController);
authRouter.post("/google",googleContoller  );
module.exports = authRouter;
const express = require("express");
const { authController,authSignInController,googleContoller,authSignOutController } = require("../controller/authController");

const authRouter = express.Router();

authRouter.post("/signup",authController);
authRouter.post("/signin",authSignInController);
authRouter.post("/google",googleContoller  );
authRouter.get("/signout",authSignOutController  );
module.exports = authRouter;
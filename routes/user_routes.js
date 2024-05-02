const express = require('express');
const router = express.Router(); 
const controller = require("../controller/user_controller");
const authCheck = require("../middleware/user_middleware");
router.post("/register",controller.register); 
router.post("/verify",controller.verifyOTP); 
//protected routes 
router.get("/",authCheck,controller.home); 
module.exports = router; 
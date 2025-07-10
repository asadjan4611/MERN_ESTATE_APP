const express = require('express');
const { createListening } = require('../controller/createListening');

const createListeningRouter = express.Router();


createListeningRouter.post("/createListening",createListening);


module.exports = {createListeningRouter}
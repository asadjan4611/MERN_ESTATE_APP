const mongoose = require('mongoose');
const express = require("express");
const dotenv = require("dotenv");
const  authRouter = require('./routes/authRoute');
const  testrouter = require('./routes/user.routes');
const  {createListeningRouter} = require('./routes/createListening');
const  {imageController} = require('./controller/imageController');
const cors  = require('cors');
const cookieParser = require('cookie-parser');
dotenv.config();
const {getListeningRoute} = require('./routes/getListeningRoute');
const app = express();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Successfull connected");
});
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, // (Optional, if using cookies/auth)
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));



app.use('/test',testrouter);
app.use('/test',createListeningRouter);
app.use('/test',getListeningRoute);
app.use('/auth',authRouter)
app.use('/image',imageController)


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

app.listen(3000,()=>{
    console.log("server is running  on port on 3000");
})
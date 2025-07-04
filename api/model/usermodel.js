const mongoose =require("mongoose");

 const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
     email:{
        type:String,
        required:true,
        unique:true
    }, 
    password:{
        type:String,
        required:true,
    },
    avatar :{
        type:String,
        default : "https://images.unsplash.com/photo-1743701168213-89acf87d972c?q=80&w=1124&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
});

module.exports = mongoose.model("User",userSchema);


const mongoose = require ('mongoose');


const ListeningModel  = mongoose.Schema(
    {
        name:{
         type:String,
         required:true
        },
         description:{
         type:String,
         required:true
        },
         address:{
         type:String,
         required:true
        },
        type:{
            type:String,
            required:true
        },
         regularPrice:{
         type:Number,
         required:true
        },
        discountPrice:{
         type:Number,
         required:true
        },
        bedrooms:{
         type:Number,
         required:true
        },
         bathrooms:{
         type:Number,
         required:true
        },
        furnished:{
            type:Boolean,
            required:true
        },
        parking :{
            type:Boolean,
            required:true
        },
        offer :{
            type:Boolean,
            required:true
        },
        imageUrl:{
            type:Array,
            required:true
        },
        useRef :{
            type:String,
            required:true
        }


},{timestamps:true});

module.exports = mongoose.model("ListeningModel",ListeningModel);
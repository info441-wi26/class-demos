import mongoose from "mongoose";


let models = {};

console.log("connecting to mongodb");
// Put your MongoDB Atlas connection string in, or
await mongoose.connect('mongodb://localhost:27017/storeDemo');
console.log("connected to mongodb");

//Add schemas and models

console.log("finished creating models");

export default models;

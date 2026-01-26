import mongoose from 'mongoose'

// models will have my db collection connections
const models = {}

console.log("connecting to mongodb")
await mongoose.connect("mongodb://localhost:27017/userDemo")

console.log("successfully connected to mongodb!")

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    favorite_ice_cream: String
})
models.User = mongoose.model('User', userSchema)

console.log('mongoose models created')

export default models
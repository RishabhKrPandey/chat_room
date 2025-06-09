const mongoose = require("mongoose")

const connectDB = async() =>{
    // write function to connect to database
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("mongoDB connected")
    }catch(error){
    console.error(`Error: ${error.message}`);
    process.exit(1); 
    }

}
module.exports = connectDB
//  schema for the chatroom
const mongoose = require("mongoose")

const RoomSchema = new mongoose.Schema({
    // it will have username,  start time , is_open, cool_down_time, meet id and password
    name : String,
    start_time : Date,
    is_open : Boolean,
    cool_down_time : Number,
    meetid : String,
    password : String,

})
module.exports = mongoose.model('Room', RoomSchema);

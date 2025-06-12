const express = require("express");
const app = express();
const fs = require('fs');
const mongoose = require('mongoose');

const PORT = 7000;

mongoose.connect('mongodb://localhost:27017/schemadb')
.then(()=> console.log("MongoDB Connected"))   //iff connected 
.catch((err)=>console.log("MongoDB Error ",err));   //iff error occurs

//schema //to define the structure of data of how will it be stored in database
const userSchema=new mongoose.Schema({
    first_name:{
        type:String,
        required:true,
    },
    last_name:{
        type:String,
    },
    start_time:{
        type:Date,
    },
    is_open:{
        type:Boolean,
    },
    cool_downtime:{
        type:Number,
    },
    meet_id:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    
});
//Model from Schema
const User=mongoose.model("user", userSchema);  //we will use this user object to do stuff

// Middleware - ORDER MATTERS!
app.use(express.json()); // This should come first to parse JSON bodies
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log("Middleware 1 executed");
  req.myUserName = "HeySiya";
  next();
});

// Routes
app.get('/users', async(req, res) => {    
  const allDbUsers= await User.find({});//  await is always used with async fn
  const html = `
    <ul>
      ${allDbUsers.map((user) => `<li>${user.first_name}-${user.meet_id}</li>`).join("")}
    </ul>
  `;
  res.send(html);
});

// REST API
app.get('/api/users', (req, res) => {
  res.setHeader("MyName", "Siya");
  return res.json(users);
});

// POST request
app.post("/api/users", async (req, res) => {
  const body = req.body;

  if (!body.first_name ) {  //|| !body.email
    return res.status(400).json({ msg: "First name required" });
  }

  try {
    const result = await User.create({
      first_name: body.first_name,
      last_name: body.last_name || '', // Handle optional fields
      start_time: body.start_time,
      is_open: body.is_open || '', // Handle optional fields
      cool_downtime: body.cool_downtime || '', // Handle optional fields
      meet_id: body.meet_id || '',
      password: body.password || '',
    });
    
    console.log("New user joined:", result); // This should show in terminal
    return res.status(201).json({ msg: 'success', data: result });
  } catch (err) {
    console.error("Error joining user:", err);
    return res.status(500).json({ msg: "Error joining user", error: err.message });
  }
});

// Grouped routes
app.route("/api/users/:id")
  .get(async (req, res) => {
    const user = await User.findById(req.params.id);    // const id = Number(req.params.id);
    // const user = users.find((user) => user.id == id);
    if(!user) return res.status(404).json({error:"user not found"});
    return res.json(user);
  })
  .patch((req, res) => { //similarly for patch use await 
    return res.json({ status: "pending" });
  })
  .delete((req, res) => {
    return res.json({ status: "pending" });
  });

app.listen(PORT, () => console.log(`Server Started at Port ${PORT}`));
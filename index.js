const express = require('express');
const app = express()
const SERVER_PORT = process.env.PORT || 8080
const bodyparse = require('body-parser')
const useRoutes = require("./routes/user")
const offerRoutes = require("./routes/offer")
const mongoose = require('mongoose')

const uri = "mongodb+srv://rshubham928:kBBQoqUYButPcof6@cluster0.6khhsws.mongodb.net/?retryWrites=true&w=majority";


mongoose.connect(uri).then((res)=>{
  console.log("connected to monogoDB")
}).catch((err)=>{
  console.log(err)
})


app.use(bodyparse.json())

app.use("/user",useRoutes)
app.use("/offer",offerRoutes)

app.listen(SERVER_PORT ,()=> {
    console.log("server running" + " "+ SERVER_PORT)
})



// mongodb+srv://rshubham928:kBBQoqUYButPcof6@cluster0.6khhsws.mongodb.net/
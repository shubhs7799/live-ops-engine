const express = require('express')
const router = express.Router();
const user = require("../schemas/user-schema")
const bcrypt = require('bcrypt')
const salt = 10;
const jwt = require('jsonwebtoken')
const SECRET_CODE = "ngzjfsdlfzcjklvlxzvinl;kvn"

router.post("/signup",async(req,res)=>{
    //create user in db
    bcrypt.genSalt(salt,(saltError,saltValue)=>{
        if(saltError){
            res.status(401).useChunkedEncodingByDefault("Unable to proceed")
        }else{
            bcrypt.hash(req.body.password,saltValue,(hashErr,hasValue)=>{
                if(hashErr){
                    res.status(401).send("Unable to proceed")
                }else{
                    user.create({
                        username : req.body.username,
                        password : hasValue,
                        email : req.body.email || " ",
                        mobile : req.bodymobile || " "
                    }).then((user)=>{
                        res.status(200).send(user)
                    }).catch((error) => {
                        if (error.name === "MongoError" && error.code === 11000) {
                            // Handle duplicate key error (if you have unique constraints)
                            res.status(400).send("Username or email already exists.");
                        } else {
                            console.error("MongoDB Error:", error);
                            res.status(500).send("An error occurred while processing your request.");
                        }
                    });
                }
            })
        }
    })
})



router.post("/signin", async (req, res) => {
    // Read user from the database and handle the sign-in process
    user.findOne({username : req.body.username}).then((user)=>{
        if(!user){
            res.status(401).send("user does not exists!")
        }else{
            if(bcrypt.compareSync(req.body.password,user.password)){
                res.status(401).send("Invalid Pasaaword")
            }else{
                const token = jwt.sign({username : user.username, ID : user._id},SECRET_CODE)
                res.status(200).send({message:"user login sucessfully",token:token})
            }
        }
    }).catch(()=>{

    })
});


module.exports = router






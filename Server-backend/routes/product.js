const express = require("express")
const router = express.Router();
const userInfo = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { body, validationResult } = require('express-validator');
const { userSignupValidation } = require("../middleWare/utility")

//testing the routes
router.get("/hussain/signup", (req, res) => {
    res.send("signup Route working!!")
})

//for new user
router.post("/api/hussain/signup",
    userSignupValidation,
    async (req, res) => {
    
        const { username, email, password, role, age, installed_days, pricing } = req.body;
        try {
            //to find valildation error
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            //checking user existance
            const isUserExist = await userInfo.find({ email });
            if (isUserExist[0]?.email) {
                return res.status(400).json({
                    message: "User already exist"
                })
            }
            //hashing the password
            bcrypt.hash(password, saltRounds, async function (err, hash) {
                if (err) {
                    return res.status(400).json({
                        message: err.message
                    })
                }
                //registering user
                const userData = await userInfo.create({
                    username,
                    email,
                    age,
                    role,
                    installed_days,
                    ...pricing,
                    password: hash,
                })
                return res.status(200).json({
                    message: "sucess",
                    data: userData
                })
            })
        } catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }

    });


//to change user password
router.put("/api/hussain/user/:emailId",
    async (req, res) => {
        const { emailId } = req.params;
        const { username, email, password, } = req.body;
        try {
            //to check validation error
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            //to find user
            const user = await userInfo.findById(emailId);
            // console.log(user)
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }
            //comparing old password
            bcrypt.compare(req.body.oldpassword, user.password, function (err, result) {
                if (err) {
                    console.log(err)
                    return res.status(400).json({
                        message: err.message
                    })
                }
                if (result) {
                    // updating new hashing password
                    bcrypt.hash(req.body.newpassword, saltRounds, async function (err, hash) {
                        if (err) {
                            return res.status(400).json({
                                message: err.message
                            })
                        }
                        
                        const updatedUser = await userInfo.updateOne({ email }, { $set: { ...req.body, password: hash } });
                        const updatedData = await userInfo.findById({ emailId });
                        return res.status(200).json({
                            message: "updated successfully",
                            data: updatedData
                        })
                    })
                } else {
                    return res.status(400).json({
                        message: "old password is not correct"
                    })
                }

            })
        } catch (e) {
            return res.status(400).json({
                message: e.message
            });
        }
    }
)

//to find all registered user
router.get("/api/hussain/userlist", async (req, res) => {
    try {
        const userlist = await userInfo.find();
        return res.status(200).json({
            message: "success",
            userlist
        })
    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
})


//find all registered user
router.delete("/api/hussian/delete/:id", async (req, res) => {
    try {
        const userlist = await userInfo.findByIdAndDelete({ _id: req.params.id })
        return res.status(200).json({
            message: "deleted",
            userlist
        })
    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
})

module.exports = router;
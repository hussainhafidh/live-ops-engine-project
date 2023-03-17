const express = require("express")
const router = express.Router();
const userInfo = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

//testing the request
router.get("/hussain/login", (req, res) => {
    res.send("login Route working!!")
})

//for new user
router.post("/api/hussain/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        //to check user existence
        const userData = await userInfo.find({ email });
     
        if (!userData[0]) {
            return res.status(400).json({
                message: "User not exist"
            })
        }
        //comparing hashing password
        bcrypt.compare(password, userData[0].password, async function (err, result) {
            if (err) {
                console.log(err)
                return res.status(400).json({
                    message: err
                })
            }
            //login successful
            if (result) {

                const Token = await jwt.sign({
                    data: userData[0].id
                }, process.env.SECRET_KEY, { expiresIn: '24h' });

                return res.status(200).json({
                    message: `${userData[0].username}  login successfully`,
                    Token
                })
            } else {
                return res.status(400).json({
                    message: " incorrect password",
                })
            }
        })
    } catch (e) {
        return res.status(400).json({
            message: e.message
        })
    }

})
module.exports = router;
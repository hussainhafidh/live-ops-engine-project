const express = require("express");
const app = express();

//importing routes
const registerRouter = require("./routes/product")
const loginRouter = require("./routes/user");
const offerRouter = require("./routes/offers")
//installing libraries
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const cors = require("cors");

const conn = require("./middleWare/connection");
conn();

const PORT = process.env.PORT || 8080

app.use(cors());
//two ways to add express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(req.url)
    try {
        if (req.url == "/api/hussain/login" || req.url == "/api/hussain/signup") {
            next();
        } else {
            let token = req.headers.authorization;
            jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
                if (err) {
                    return res.status(400).json({
                        message: err.message
                    })
                }
                res.user = decoded.data;
                next()
            });
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }

})

//routes testing
app.get("/", (req, res) => {
    res.send(" APP WORKING")
})


app.use("/", registerRouter);
app.use("/", loginRouter);
app.use("/", offerRouter)

app.listen(PORT, () => {
    console.log(`server started at ${PORT}!!`)
})
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

app.use("/api", authRoutes);

app.get("/api/skyddad", authenticateToken, (req, res) => {
    res.json({ message: "Skyddad route! "});
})

//Validerar token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) res.status(401).json({ message: "Du har ej tillgång till denna route - token saknas."});

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {
        if (err) return res.status(403).json({ message: "Ogiltig JWT"});

        req.username = username;
        next();
    });
}

//Starta applikationen
app.listen(port, () => {
    console.log("Servern är startad på port: " + port);
})
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

app.use("/api", authRoutes);

//Starta applikationen
app.listen(port, () => {
    console.log("Servern är startad på port: " + port);
})
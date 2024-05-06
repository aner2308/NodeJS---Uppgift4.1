//Routes för auth
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
require("dotenv").config();

//Koppla till MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL).then( () => {
    console.log("Kopplad till MongoDB-databasen.")
}).catch((error) => {
    console.error("Fel vid koppliing till databasen...")
});

//Användar model
const User = require("../models/User");

//Lägg till ny användare
router.post("/register", async (req, res) => {
    try {
        const { username, password} = req.body;

        //Validera input
        //VIDAREUTVECKLA!!!
        if (!username || !password) {
            return res.status(400).json({error: "Felaktig inmatning, skriv in användarnamn och lösenord..."})
        }

        //Om inmatning är korrekt
        const user  = new User({ username, password });
        await user.save();

        res.status(201).json({ message: "Användare skapad"});

    } catch {
        res.status(500).json({ error: "Server error"});
    }
});

//Logga in användare
router.post("/login", async(req, res) => {
    try {
        const { username, password} = req.body;

        //Validera input
        //VIDAREUTVECKLA!!!
        if (!username || !password) {
            return res.status(400).json({ error: "Felaktig inmatning, skriv in användarnamn och lösenord..."})
        }

        //Kontrollerar om användaren existerar 
        const user = await User.findOne({ username });
        if(!user) {
            return res.status(401).json({ error: "Felaktigt användarnamn/lösenord!"});
        }

        //Kontrollera lösenord
        const isPasswordMatch = await user.comparePassword(password);
        if(!isPasswordMatch) {
            return res.status(401).json({ error: "Felaktigt användarnamn/lösenord!"});
        } else {
            const payload = { username: username};
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            const response = {
                message: "Användare inloggad",
                token: token
            }
            res.status(200).json({ response });
        }


    } catch {
        res.status(500).json({ error: "Server error"});
    }
})

module.exports = router;
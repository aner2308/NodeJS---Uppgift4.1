//Routes för auth
const express = require("express");
const router = express.Router();

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

        if (username === "Anton" && password === "test") {
            res.status(200).json({ message: "Inloggningen lyckades!"});
        } else {
            res.status(401).json({ error: "Felaktigt användrnamn/lösenord."})
        }

    } catch {
        res.status(500).json({ error: "Server error"});
    }
})

module.exports = router;
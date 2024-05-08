const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const url = process.env.MONGO_URL;
app.use(bodyParser.json());
app.use(cors());

app.use("/api", authRoutes);

app.get("/api/skyddad", authenticateToken, (req, res) => {
    res.json({ message: "Skyddad route! "});
})

// Funktion för att skapa en ny samling "jobs" i databasen
async function createJobsCollection() {
    try {
        const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        const database = client.db(); // Här kan du specificera databasnamn om det inte är standard

        // Skapa samlingen om den inte redan finns
        await database.createCollection("jobs");

        console.log("Jobs collection created successfully!");
        
        client.close();
    } catch (error) {
        console.error("Error creating jobs collection:", error);
    }
}

//Validerar token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) res.status(401).json({ message: "Du har ej tillgång till denna route - token saknas."});

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, username) => {
        if (err) return res.status(403).json({ message: "Ogiltig JWT"});

        req.username = username;

        await createJobsCollection();

        next();
    });
}

//Starta applikationen
app.listen(port, () => {
    console.log("Servern är startad på port: " + port);
})
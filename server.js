const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const url = process.env.MONGO_URL;
app.use(bodyParser.json());
app.use(cors());

app.use("/api", authRoutes);

//Lägger till nya posts i min skyddade databas, detta är för test i TC
app.post("/api/skyddad", authenticateToken, async (req, res) => {
    try {
        // Skapa ett nytt jobbobjekt med data från begäran
        const newJob = new Job({
            companyname: req.body.companyname,
            jobtitle: req.body.jobtitle,
            location: req.body.location,
            description: req.body.description,
        });

        // Spara det nya jobbet i databasen
        await newJob.save();

        res.status(201).json({ message: "Jobbet har lagts till i databasen." });
    } catch (error) {
        console.error("Error adding job to database:", error);
        res.status(500).json({ message: "Ett fel uppstod när jobbet skulle läggas till i databasen." });
    }
});

app.get("/api/skyddad", authenticateToken, async (req, res) => {
    try {
        // Hämta alla jobb från databasen
        const jobs = await Job.find();

        res.json(jobs);
    } catch (error) {
        console.error("Error fetching jobs from database:", error);
        res.status(500).json({ message: "Ett fel uppstod när jobben skulle hämtas från databasen." });
    }
});

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

//Jobb schema
const jobSchema = new mongoose.Schema({
    companyname: {
        type: String,
        required: true,
    },
    jobtitle: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now
    }
});

const Job = mongoose.model("Job", jobSchema);

// Middleware för att verifiera JWT och skapa "jobs" collection
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ message: "Du har ej tillgång till denna route - token saknas."});

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, username) => {
        if (err) return res.status(403).json({ message: "Ogiltig JWT"});

        req.username = username;

        // Skapa "jobs" collection om den inte redan finns
        await createJobsCollection();

        next();
    });
}



//Starta applikationen
app.listen(port, () => {
    console.log("Servern är startad på port: " + port);
})
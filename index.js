const express = require("express");
const personn = require("./models/personn.model");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const peuple = require("./models/peuple.data");
require("dotenv").config();
app.use(express.json());

const port = 5000;

app.get("/", (req, res) => {
    res.send("hello world!");
});

// ajouter de personne via postman

app.post("/personn", async (req, res) => {
    try {
        const person = new personn(req.body);
        const result = await person.save();
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//ajouter un documment avec plusieur user
app.post("/creation", async (req, res) => {
    try {
        // Utiliser les données importées pour créer plusieurs enregistrements
        const result = await personn.create(peuple);

        // Envoyer une réponse réussie
        res.status(201).json(result);
    } catch (err) {
        // Envoyer une erreur en cas d'échec
        res.status(400).json({ message: err.message });
    }
});

// chercher une personne avec son id

app.get("/personn/:id", async (req, res) => {
    try {
        const person = await personn.findById(req.params.id);

        if (!person) {
            return res.status(404).send("Personne non trouvée");
        }

        res.json(person);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// supprimer un user a traves son id

app.delete("/personn/:id", async (req, res) => {
    try {
        const person = await personn.findByIdAndDelete(req.params.id);

        if (!person) {
            return res.status(404).send("Personne non trouvée");
        }

        res.json(person);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// utuliser fin() pour trouver tout les utulisateur de la db

app.get("/chercher", async (req, res) => {
    try {
        const person = await personn.find();
        res.json(person);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// utuliser find one pour trouver un user avec un nom 

app.get("/chercher/:name", async (req, res) => {
    try {
        const person = await personn.findOne({ name: req.params.name });

        if (!person) {
            return res.status(404).send("Personne non trouvée");
        }

        res.json(person);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

//Find a person by _id ( use any of the above methods ) with the parameter personId as a search key. Add "hamburger" to the list of the person's favoriteFoods (you can use Array.push()). Then - inside the find callback - save() the updated Person.

app.put("/personn/:id/addHamburger", async (req, res) => {
    try {
        const person = await personn.findByIdAndUpdate(
            req.params.id,
            { $push: { favoriteFood: "hamburger" } },
            { new: true }
        );

        if (!person) {
            return res.status(404).send("Personne non trouvée");
        }

        res.json(person);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

//remove  many document with model.remov 

app.delete("/personn/removeMany", async (req, res) => {
    try {
        const result = await personn.deleteMany();
        res.json(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

//Delete all the people whose name is “Mary”

app.delete("/personn/removeMary", async (req, res) => {
    try {
        const result = await personn.deleteMany({ name: "Mary" });
        res.json(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

//Find people who like burritos. Sort them by name, limit the results to two documents, and hide their age

app.get("/personn/burritos", async (req, res) => {
    try {
        const person = await personn.find({ favoriteFood: "burrito" })
           .sort({ name: 1 })
           .limit(2)
           .select("-age");

        res.json(person);
    } catch (error) {
        res.status(400).send(error.message);
    }
});




// Connect to MongoDB

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connecté à MongoDB avec succès !");
    })
    .catch((err) => {
        console.error("Erreur de connexion à MongoDB :", err);
    });

app.listen(port, (err) => {
    if (err) {
        console.error(`Error starting server: ${err}`);
        process.exit(1);
    }
    console.log(`Server running at http://localhost:${port}`);
});

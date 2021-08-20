const express = require('express');
const app = express();
const path = require('path');
const passport = require('passport');
const morgan = require('morgan');
const mongoose = require('mongoose');
const db = require(path.resolve("database"));
const method = require("method-override");
require("dotenv/config")


// app.use(method("_method"))
const user = require(path.resolve("route"));

db.connect(process.env.MONGODB_URI);
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index");
})

app.set("view engine", "ejs");
app.set("views", path.join(path.resolve("views")));

app.use(user)

app.listen(3000, () => console.log('Listening on port 3000'));
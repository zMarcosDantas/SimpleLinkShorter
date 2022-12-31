require("dotenv").config();

const fs = require('fs');
const express = require("express");
const router = express.Router();
const linkSize   = process.env.SIZE;
const baseString = process.env.STRING;
const clearExpired = require("../middleware/middleware");

const {randomFromString, checkRegex, deleteId} = require("../utils/utils");

/* HTML CREATE ROUTE */
router.get("/" + process.env.CREATE_ROUTE, clearExpired, (req, res) => {
    res.render("pages/createLink", {createRoute: process.env.CREATE_ROUTE, redirectRoute: process.env.REDIRECT_ROUTE});
});

/* POST CREATE ROUTE */
router.post("/" + process.env.CREATE_ROUTE, clearExpired, (req, res) => {
    try {
        var {redirect, password, timer, infinite, predefinedName, overwrite, textContent} = req.body;
        if(!redirect) throw "No URL on requisition!";
        const validURL = checkRegex(redirect);
        if(!validURL) throw "Invalid URL!";
        if(isNaN(timer)) throw "Time is invalid, it has to be a number.";
        if(password !== process.env.PASS) throw "Invalid Pass!";
        if(timer < 0) timer *= -1;
        const links = fs.readFileSync("./links.json");
        const parsed = JSON.parse(links);
        
        const checkTime = new Date().getTime();

        let attemps = 0;
        do {
            if(attemps >= Math.pow(baseString.length, linkSize)) break;
            attemps++;
            var generatedId = randomFromString(linkSize, baseString);
        }
        while(parsed.hasOwnProperty(generatedId) && !predefinedName);

        const id = predefinedName || generatedId; 
        if(parsed[id]?.overwrite === false && checkTime < ((parsed[id]?.expireTime) ? parsed[id]?.expireTime : Infinity)) throw "Já um link fixo com esse ID e o mesmo não pode ser alterado!";

        if(infinite) {
            timer = null;
        } else {
            timer = 60 * 1000 * timer;
            deleteId(id, timer);
        }

        parsed[id] = {
            redirect,
            overwrite,
            expire: timer,
            expireTime: timer ? new Date().getTime() + timer : undefined,
            textContent
        }

        console.log("[Created]", id)

        fs.writeFileSync("./links.json", JSON.stringify(parsed), 'utf-8');

        return res.json({status: 1, id});
    } catch(error) {
        console.log('[ERROR]', error);
        res.json({status: 0, message: error});
    }
});

module.exports = router;
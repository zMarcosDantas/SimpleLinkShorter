require("dotenv").config();

const fs = require('fs');
const express = require("express");
const router = express.Router();
const clearExpired = require("../middleware/middleware");

const {checkRegex} = require("../utils/utils");

/* POST EDITING ROUTE */
router.post("/" + process.env.UPDATE_ROUTE, clearExpired, (req, res) => {
    try {
        var {id, newId, redirect, password, timer, infinite, overwrite, textContent} = req.body;

        if(!id) throw "No id has been passed!";
        
        const links = fs.readFileSync("./links.json");
        const parsed = JSON.parse(links);
        if(!parsed[id]) throw "Theres no link with this id!";

        if(parsed[newId]?.overwrite === false || parsed[id]?.overwrite === false) throw "This id is already taken and cant be changed!";

        if(redirect) {
            const validURL = checkRegex(redirect);
            if(!validURL) throw "O link é inválido!";
        };

        if(timer) {
            if(isNaN(timer)) throw "O tempo é inválido, tem que ser um número";
            if(timer < 0) timer *= -1;
        };

        if(password !== process.env.PASS) throw "Invalid Pass!";

        if(infinite) {
            timer = null;
        } else {
            timer = 60 * 1000 * timer;
        }

        parsed[id].redirect = redirect || parsed[id].redirect;
        parsed[id].textContent = textContent;
        if(typeof timer === 'number') {
            parsed[id].expire = timer;
            parsed[id].expireTime = timer ? new Date().getTime() + timer : undefined;
        } else if(typeof timer === "object") {
            parsed[id].expire = null;
            parsed[id].expireTime = undefined;
        }

        if(typeof overwrite === "boolean") {
            parsed[id].overwrite = overwrite;
        }

        if(newId && newId != id) {
            parsed[newId] = parsed[id];
            delete parsed[id];
        };

        console.log("[Updated]", newId ? newId : id)

        fs.writeFileSync("./links.json", JSON.stringify(parsed));
        res.json({status: 1, message: "Changed!"});
    } catch(error) {
        console.log('[ERROR]', error);
        res.json({status: 0, message: error});
    }
});

module.exports = router;
require("dotenv").config();

const fs = require('fs');
const express = require("express");
const router = express.Router();

const clearExpired = require("../middleware/middleware");

router.post("/" + process.env.DELETE_ROUTE, clearExpired, (req, res) => {
    try {
        const { id, password } = req.body;

        if(!id) throw "No id has been passed!";

        const links = fs.readFileSync("./links.json");
        const parsed = JSON.parse(links);

        if(!parsed[id]) throw "Theres no link with this id!";

        if(password !== process.env.PASS) throw "Invalid Pass!";

        delete parsed[id];

        console.log("[Deleted]", id);
        fs.writeFileSync("./links.json", JSON.stringify(parsed));
        res.json({status: 1, message: "Deleted!"});
    } catch(error) {
        console.log('[ERROR]', error);
        res.json({status: 0, message: error});
    }
});

module.exports = router;
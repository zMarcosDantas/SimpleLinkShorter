require("dotenv").config();

const fs = require('fs');
const express = require("express");
const router = express.Router();

const clearExpired = require("../middleware/middleware");

/* POST REDIRECT ROUTE */
router.get("/" + process.env.REDIRECT_ROUTE + "/:id", clearExpired, (req,res) => {
    try {
        const id = req.params.id;
        const links = fs.readFileSync("./links.json");
        const parsed = JSON.parse(links);
        if(!parsed[id]) throw "Invalid or expired URL!";

        if(parsed[id].textContent) return res.render("pages/redirectText", {textContent: parsed[id].textContent, redirect: parsed[id].redirect});
        res.redirect(parsed[id].redirect);
    } catch (error) {
        console.log(error);
        res.json({status: 0, message: error});
    }

});

module.exports = router;
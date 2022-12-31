require("dotenv").config();

const fs = require('fs');
const express = require("express");
const router = express.Router();

const clearExpired = require("../middleware/middleware");

/* HTML LISTING ROUTE */
router.get("/" + process.env.LIST_ROUTE, clearExpired, (req, res) => {
    try {
        const links = fs.readFileSync("./links.json");
        const parsedLinks = JSON.parse(links);
        res.render("pages/panelList", {links: parsedLinks, deleteRoute: process.env.DELETE_ROUTE, editRoute: process.env.UPDATE_ROUTE});
    } catch(error) {
        console.log('[ERROR]', error);
        res.json({status: 0, message: error});
    }

});

module.exports = router;
const fs = require("fs");

function clearExpired(req, res, next) {
    const links = fs.readFileSync("./links.json");
    const parsedLinks = JSON.parse(links);
    
    const date = new Date().getTime();
    Object.entries(parsedLinks).forEach(el => {
        if(date >= el[1]?.expireTime) {
            delete parsedLinks[el[0]];
        }
    });

    fs.writeFileSync("./links.json", JSON.stringify(parsedLinks));
    next();
}

module.exports = clearExpired;
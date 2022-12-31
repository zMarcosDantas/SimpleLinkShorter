const fs = require("fs");

function randomFromString(length = 3, defaultString = "123") {
    let string = defaultString;
    let sLength = string.length;

    let result = "";
    for(let i = 0; i < length; i++) {
        result += string.charAt(Math.floor(Math.random() * sLength));
    }

    return result;
}

function waitTime(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, time);
    })
}

function checkRegex(checkUrl) {
    const regexURL = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g);
    return regexURL.test(checkUrl);
};

async function deleteId(id, time) {
    if(time) console.log("[Deleting]", id, "in", time, "miliseconds");
    await waitTime(time);
    let links = fs.readFileSync("./links.json");
    let parsed = JSON.parse(links);
    if(time < parsed[id]?.expire) return;
    if(parsed[id]?.expire) {
        delete parsed[id];
        console.log("[Deleted]",id);
        fs.writeFileSync("./links.json", JSON.stringify(parsed), 'utf-8');
    }
};


module.exports = { randomFromString, waitTime, checkRegex, deleteId};
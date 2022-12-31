require("dotenv").config();

const express   = require("express");
const app       = express();

/* routes */
const create    = require("./routes/create");
const update    = require("./routes/update");
const del       = require("./routes/delete");
const redirect  = require("./routes/redirect");
const dashboard = require("./routes/dashboard");

/* express logic */ 
app.use(express.json());
app.use(express.static("public"));

app.set("view engine", "ejs");

/* routes */
app.use("/", create);
app.use("/", update);
app.use("/", del);
app.use("/", redirect);
app.use("/", dashboard);

app.get("/", (req, res) => {
    res.json({status: 1, message: "Server running!"});
});

app.listen(process.env.PORT, () => {
    console.log("Servidor rodando!");
})
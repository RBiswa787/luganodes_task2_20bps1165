require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

let corsOptions = {
    origin: ["*"]
};

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.get('/',(req,res) => { 
    res.send("Server Available!");
});

const PORT = 5000

app.listen(PORT,() => {
    console.log(`Server listening at port ${PORT}`);
});
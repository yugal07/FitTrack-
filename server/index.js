const express = require('express');
require('dotenv').config();
const cors = require("cors")
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser());

const app = express();

const PORT = process.env.PORT || 8001

app.get('/', (req,res)=>{
          res.json({message: "abc"})
})

app.listen(PORT, () => {
          console.log("got your server running B")
})
require("dotenv").config()
const express = require("express")
const app = express();
const morgan = require("morgan");
const cors = require("cors");


app.use(express.json());
app.use(morgan("dev"))

app.use(cors());

app.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
  
    next();
  });

  const apiRouter = require("./api");
  
  
  
  app.use("/api", apiRouter);

  app.use((req, res) => {
    res.status(404).send(
      {success: false , message: "Request failed with status 404"} 
    );
  });
  
  app.use((req, res) => {
    res
      .status(500)
      .send(
        {success: false, message: "Request failed with status 500" }
      );
  });
  
module.exports = app;

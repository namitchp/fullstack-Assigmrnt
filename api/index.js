const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoute = require("./controller/auth");

require("dotenv").config();
const app = express();
app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(express.json());
  
  app.get("/", (req, res, next) => {
    res.status(200).json({
      message: "Crud Operation",
    });
  });
 app.use("/api",userRoute);
  const port = process.env.Port || 9000;
  app.listen(port, () => {
    console.log(`server listen ${port}`);
  });
// }

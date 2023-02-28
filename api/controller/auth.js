const userRoute = require("express").Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const authToken = require("../middleware/auth");
const sql = require("mssql");
const nodemailer = require("nodemailer");
const { config } = require("../config/config");
const axios = require("axios");
const moment = require("moment");
userRoute.post("/check", async (req, res, next) => {
  try {
    await sql
      .connect(config)
      .then((pool) => {
        return pool
          .request()
          .input("mobile", req.body.mobile)
          .input("otp", req.body.otp)
          .execute("check_otp");
      })
      .then((result) => {
        if (result.recordset.length > 0) {
          const user = {
            user_id: result.recordset[0].user_id,
          };
          sendEmail(
            result.recordset[0].email,
            "Success Sign in",
            result.recordset[0].otp,true
          );
          const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

          res.status(200).json({
            message: "success",
            status: 200,
            valid: true,
            userName: result.recordset[0].first_name,
            token: accessToken,
          });
        } else {
          res.json({
            message: "Invalid Otp",
            valid: false,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({
          message: err,
          status: 400,
        });
      });
  } catch (err) {
    res.status(500).json({
      message: err,
      status: 500,
    });
  }
});
userRoute.post("/login", async (req, res, next) => {
  try {
    await sql
      .connect(config)
      .then((pool) => {
        return pool
          .request()
          .input("mobile", req.body.mobile)
          .execute("check_login");
      })
      .then((result) => {
        if (result.recordset.length > 0) {
          const user = {
            user_id: result.recordset[0].user_id,
          };
        //   sendWhatsapp(result.recordset[0].mobile, result.recordset[0].otp);
          sendEmail(
            result.recordset[0].email,
            "OTP Verification",
            result.recordset[0].otp,false
          );
          const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

          res.status(200).json({
            message: "success",
            status: 200,
            valid: true,
            userName: result.recordset[0].first_name,
            token: accessToken,
          });
        } else {
          res.json({
            message: "Invalid UserName Or Password",
            valid: false,
          });
        }
      })
      .catch((err) => {
        res.status(400).json({
          message: "" + err,
          status: 400,
        });
      });
  } catch (err) {
    res.status(500).json({
      message: err,
      status: 500,
    });
  }
});

userRoute.post("/singUp", async (req, res, next) => {
  try {
    await sql
      .connect(config)
      .then((pool) => {
        return pool
          .request()
          .input("user_id", req.body.user_id)
          .input("first_name", req.body.first_name)
          .input("last_name", req.body.last_name)
          .input("mobile", req.body.mobile)
          .input("email", req.body.email)
          .output("new_identity")
          .execute("insert_users");
      })
      .then((result) => {
        res.status(200).json({
          message: "success",
          status: 200,
          valid: true,
        });
      })
      .catch((err) => {
  
        res.status(400).json({
          message: err,
          status: 400,
        });
      });
  } catch (err) {
    res.status(500).json({
      message: err,
      status: 500,
    });
  }
});

userRoute.post("/browse", async (req, res, next) => {
  try {
    await sql
      .connect(config)
      .then((pool) => {
        return pool
          .request()

          .query("select * from tbl_user");
      })
      .then((result) => {
        res.status(200).json({
          message: "success",
          status: 200,
          valid: true,
          data: result.recordset,
        });
      })
      .catch((err) => {
     
        res.status(400).json({
          message: err,
          status: 400,
        });
      });
  } catch (err) {
    res.status(500).json({
      message: err,
      status: 500,
    });
  }
});
userRoute.post("/delete", async (req, res, next) => {
  try {
    await sql
      .connect(config)
      .then((pool) => {
        return pool
          .request()
          .input("user_id", sql.Int, (user_id = req.body.user_id))
          .query("delete from tbl_user where user_id=@user_id");
      })
      .then((result) => {
        res.status(200).json({
          message: "success",
          status: 200,
          valid: true,
        });
      })
      .catch((err) => {
   
        res.status(400).json({
          message: err,
          status: 400,
        });
      });
  } catch (err) {
    res.status(500).json({
      message: err,
      status: 500,
    });
  }
});
function sendEmail(mailto, subject, otp,type) {
  var msg =type?'Welcome you Sign In': `Your verification OTP code is ${otp} (valid for 10 minutes) Please do not share OTP with anyone.(Generated at ${moment().format(
    "lll"
  )}`;
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "namit10082003@gmail.com",
      pass: "suyq vedd mtjw cxss",
    },
  });

  var mailOptions = {
    from: "namit10082003@gmail.com",
    to: mailto,
    subject: subject,
    html: msg,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("error");
    } else {
      console.log("'Email sent: ' + info.response");
    }
  });
}
const sendWhatsapp = async (mobile, otp) => {
  // var msg = `Your verification OTP code is ${otp} (valid for 10 minutes) Please do not share OTP with anyone.(Generated at ${moment().format('lll')}`;
  token = process.env.TOKEN || 2334;
  await axios
    .get(
      "https://md1.enotify.app/api/sendText?token=" +
        token +
        "&phone=91" +
        mobile +
        "&message=" +
        "cgh" +
        ""
    )
    .then((response) => {
      // console.log(response.data.status)
    });
};

module.exports = userRoute;

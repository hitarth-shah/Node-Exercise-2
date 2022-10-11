const User = require("../Model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async function (req, res) {
  try {
    if (isEmpty(req.body.name)) {
      return res.status(400).send({
        message: "Name Required.",
      });
    }
    if (isEmpty(req.body.email)) {
      return res.status(400).send({
        message: "Email Required.",
      });
    }
    const checkEmail = await User.find({ email: { $in: [req.body.email] } });
    if (!isEmpty(checkEmail)) {
      return res.status(400).send({
        message: "Email already exist.",
      });
    }

    if (isEmpty(req.body.password)) {
      return res.status(400).send({
        message: "Password Required.",
      });
    }
    if (req.body.password !== req.body.cpassword) {
      return res.status(400).send({
        message: "Password and Confirm Password should be same.",
      });
    }
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    user.password = await bcrypt.hash(req.body.password, 10);
    user = await user.save();
    res.send(user);
  } catch (e) {
    res.send(e.message);
  }
};

exports.login = async function (req, res) {
  try {
    if (isEmpty(req.body.email)) {
      return res.status(400).send({
        message: "Email Required",
      });
    }

    if (isEmpty(req.body.password)) {
      return res.status(400).send({
        message: "Password Required",
      });
    }
    const user = await User.find({ email: req.body.email }).exec();
    console.log(user[0]);
    if (
      user.length > 0 &&
      (await bcrypt.compare(req.body.password, user[0].password))
    ) {
      let token = jwt.sign(JSON.stringify(user[0]), "mySecret");
      console.log(token);
      res.status(200).send({
        message: "Login Successfully",
        token: token,
      });
    } else {
      res.status(200).send({
        message: "Email and Password Not Match",
      });
    }
  } catch (e) {
    console.log(e, "");
    res.send(e.message);
  }
};

exports.profile = async function (req, res) {
  try {
    if (!isEmpty(req.body.token)) {
      const decode = jwt.verify(
        req.body.token,
        "mySecret",
        function (err, decoded) {
          console.log(decoded, "");
          if (!isEmpty(decoded)) {
            res.status(200).send({
              login: true,
              data: decoded,
            });
          } else {
            res.status(200).send({
              login: false,
            });
          }
        }
      );
    } else {
      console.log("login false");
      res.status(200).send({
        login: false,
        data: "error",
      });
    }
  } catch (e) {
    console.log(e, "");
    res.send(e.message);
  }
};

exports.logout = async function (req, res) {
  try {
    req.logOut();
  } catch (e) {
    res.send(e.message);
  }
};

isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    Object.keys(value).length === 0
  );
};

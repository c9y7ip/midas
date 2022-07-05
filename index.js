const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;

const { Pool } = require("pg");
const pool = new Pool({
  connectionString: "postgres://postgres:postgres@localhost/users",
});

express()
  .use(express.static(path.join(__dirname, "public")))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))

  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")

  .get("/", (req, res) => res.send("Server Connected!"))

  .post("/signup", (req, res) => {
    console.log(req.body);
    var firstName = req.body.fname;
    var lastName = req.body.lname;
    var username = req.body.username;
    var password = req.body.password;

    const accountInfo =
      "INSERT INTO account(username,password,fname,lname) values ($1,$2,$3,$4)";
    const accountVal = [username, password, firstName, lastName];

    pool.query(
      "SELECT * from account WHERE username = '" + username + "'",
      (err, ans) => {
        if (ans.rowCount == 0) {
          pool.query(accountInfo, accountVal);
          res.render("pages/loginPage", { loginInfo: "Account Created !" });
        } else if (ans.rowCount == 1) {
          res.render("pages/loginPage", { loginInfo: "Exisiting Account !" });
        }
      }
    );
  })

  .post("/login", (req, res) => {
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;

    pool.query(
      "SELECT * from account WHERE username = '" +
        username +
        "'" +
        "and password = '" +
        password +
        "'",
      (err, ans) => {
        if (ans.rowCount == 0) {
          res.render("pages/loginPage", { loginInfo: "User not found !" });
        } else if (ans.rowCount == 1) {
          res.render("pages/loginPage", { loginInfo: "Logged In !" });
        }
      }
    );
  })

  .listen(PORT, () => console.log(`Listening on ${PORT}`));

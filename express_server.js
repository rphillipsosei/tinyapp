const express = require("express");
const res = require("express/lib/response");
const app = express();
const PORT = 8080;
const cookieParser = require("cookie-parser");
const bcrypt = require('bcryptjs');

const bodyParser = require("body-parser");
const { response } = require("express");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());



const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateRandomString(length) {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}



function checkUser(email) {
  for (let element in users) {
    if (users[element].email === email) {
      return users[element];
    }
  }
  return null;
}

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  console.log(users);
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const userID = req.cookies["user_id"];
  if (userID == null) {
    return res.redirect("/login");
  }
  const templateVars = { urls: urlDatabase, user: users[userID] };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    return res.status(404).send("Short URL does not exist.");
  }
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const userID = req.cookies.user_id;
  const shortURL = generateRandomString(6);
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: userID,
  };
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});


app.post("/login", (req, res) => {
  const email = req.body.email;
  const user = checkUser(email);

  if (!email || !password) {
    return res.status(400).send("Please enter email and/or password.");
  }
  if (!user) {
    return res
      .status(403)
      .send("Sorry, email entered does not match our files.");
  }
  if (!bcrypt.compareSync(user.password, req.body.password)) {
    return res
      .status(403)
      .send("Sorry, the credentials entered do not match our files.");
  }
  
  res.cookie("user_id", user.id);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  const templateVars = { user: null };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  //define keys in new user object(new users)
  const idKey = generateRandomString(10);
  const email = req.body.email; 
  const password =  bcrypt.hashSync(req.body.password, 10);

  //conditionals for reg errors (reg errors)
  if (!email || !password) {
    return res.status(400).send("Please enter email and/or password.");
  }
  const userExist = checkUser(email);

  if (userExist) {
    return res.status(400).send("Sorry, user already exists!");
  }
  //object to be filled out by client inputs then pushed to users(new users)
  const newUser = {
    id: idKey,
    email: email,
    password: password,
  };

  //add newUser to users obj
  users[idKey] = newUser;

  //cookie recording generated id(new usesrs)
  res.cookie("user_id", idKey);

  //redirect to urls (new users)
  res.redirect("/urls");
});

//login get req (new login page)
app.get("/login", (req, res) => {
  const templateVars = { user: null }; //not correct, how to access required i
  res.render("login", templateVars);
});

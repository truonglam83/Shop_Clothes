require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejs = require("ejs");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const passport = require("./middlewares/passport");
/*-------------------Routes------------------------*/
const defaultRoutes = require("./routes/defaultRoute");
const adminRoutes = require("./routes/adminRoute");
const apiRoutes = require("./api");

/*---Configure expresss----*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "somesecret",
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

/* Configure Mongoose to COnnect to MongoDB */
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((response) => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log("MongoDB connected FAILED");
  });

/*-----Setup view Engine To Use Handlebars-------- */
app.set("view engine", "ejs");
/*----------Setup method-OverRide-------- */
app.use(methodOverride("newMethod"));
/*-----Setup Flash and Session-------- */
app.use(
  session({
    secret: "work hard",
    saveUninitialized: false,
    resave: true,
  })
);

// Check login user

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login");
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      if (user.isAdmin) {
        return res.redirect("/admin");
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

app.use("/", defaultRoutes);
app.use("/admin", adminRoutes);
app.use("/api", apiRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

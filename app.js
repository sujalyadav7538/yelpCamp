const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { campgroundSchema, reviewSchema } = require("./schemas.js");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError");
const catchAsync = require("./utils/catchAsync");
const campgrounds = require("./routes/campgrounds.js");
const reviews = require("./routes/review");

mongoose
  .connect(
    "mongodb+srv://sujalyadav7538:" +
      encodeURIComponent("Sujal7538@") +
      "@cluster0.ktczxcv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("index", (req, res) => {
  res.send("hello");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message);
    throw new ExpressError(msg, 404);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 404);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/campgrounds", campgrounds);
app.use(
  "/campgrounds/:id/reviews",
  (req, res, next) => {
    req.body.id = req.params.id
    next();
  },
  reviews
);

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).json({ error: message });
});

// app.all('',(req,res,next)=>{
//     next( new ExpressError('Page not found',404));
// })

app.listen("8000", () => {
  console.log("Listening on port 8000!!!");
});

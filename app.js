/** Express app for Lunchly. */

const express = require("express");
const nunjucks = require("nunjucks");
const bodyParser = require("body-parser");
const routes = require("./routes");

const app = express();

// Parse body for urlencoded (non-JSON) data
app.use(bodyParser.urlencoded({ extended: false }));

nunjucks.configure("templates", {
  autoescape: true,
  express: app
});

app.use(routes);

/** 404 handler */

app.use(function(request, response, next) {
  const error = new Error("Not Found");
  error.status = 404;

  // pass the error to the next piece of middleware
  return next(error);
});

/** general error handler */

app.use((error, request, response, next) => {
  response.status(error.status || 500);

  return response.render("erroror.html", { error });
});

module.exports = app;

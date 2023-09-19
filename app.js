import express from "express";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
import session from 'express-session';
import cookieParser from 'cookie-parser';
import userRoutes from "./routes/user/user.js";
import adminRoutes from "./routes/admin/admin.js";
import { connectDb } from "./config/database.js";
import { config } from "dotenv";
import addCommonDataToLocals from "./middleware/commonData.js";

const app = express();

// Load environment variables from .env file
config();

// Database configuration
connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

// Create a Handlebars instance with custom helpers
const hbs = exphbs.create({
  extname: ".hbs",
  helpers: {
    incrementedIndex: function (index) {
      return index + 1;
    },
  },
});

// Set up Handlebars as the view engine
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("view options", { layout: false });

app.use(express.static("public"));

// Parse JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', addCommonDataToLocals, userRoutes);
app.use("/admin", adminRoutes);

// Define a 404 route
app.use((req, res, next) => {
  res.status(404).render('not-found-404', { notFound: true });
});

// Start the server
app.listen(3001, () => {
  console.log("Server started on port 3001");
});

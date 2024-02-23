// Libraries
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import logger from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";

// Config
import { __dirname } from "./utils.js";
import { connectDB } from "./config/config.js";
import { initializePassport } from "./config/passport.config.js";

// Router
import appRouter from "./routes/index.routes.js";

const app = express();

connectDB();
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(cookieParser());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://tomasAdmin:0QyJ3SSkPBqPmLpC@cluster-coderhouse.bg10jwi.mongodb.net/ecommerce?retryWrites=true&w=majority",
    }),
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
  })
);

// Init passport
initializePassport();
app.use(passport.initialize());

// Init handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Init Routers
app.use("/api", appRouter);

// Dont found the page
app.get("*", (req, res) => {
  res.send("not found");
});

// Create server on port 8080
const httpServer = app.listen(8080, () => {
  console.log("Listening port 8080");
});

// Create webSocket
export const io = new Server(httpServer);

// Sockets
//chatSocket();

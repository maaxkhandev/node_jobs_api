require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

//connectDB
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");
// routers
const authRouter = require("./routes/auth.route");
const jobsRouter = require("./routes/jobs.route");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const { register } = require("./controllers/auth.controller");

app.use(express.json());
// extra packages

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

connectDB(process.env.MONGO_URI);

app.listen(port, () => console.log(`Server is listening on port ${port}...`));

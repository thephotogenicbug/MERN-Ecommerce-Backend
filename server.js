const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./database/db");
const dotenv = require("dotenv");


// middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
dotenv.config();

// mongoDB
connectDB();

//auth routes
const authRoutes = require("./routes/auth");
app.use('/api/auth', authRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

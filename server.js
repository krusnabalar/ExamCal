require('dotenv').config();
const bp = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");
const getFinals = require("./api/getFinals");
const sendEmail = require("./api/sendEmail");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(bp.json());

app.use("/api/getFinals", getFinals);
app.use("/api/sendEmail", sendEmail);

app.get("/api/", async (req, res) => {
  res.status(200).json({ message: "Welcome to UBC ExamCal!" });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static('client/public'));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "public", "index.html"));
  });
}

app.listen(PORT, () => console.log("Running at port " + PORT));
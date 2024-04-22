require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
});

app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/fileanalyse", upload.single("upfile"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  if (req.file.size > 4 * 1024 * 1024) {
    return res.status(400).json({ error: "The file is larger than 4MB" });
  }

  const { originalname, mimetype, size } = req.file;
  const fileInfo = { name: originalname, type: mimetype, size };

  res.json(fileInfo);
});

app.use(function (err, req, res, next) {
  if (err instanceof bodyParser.errors.PayloadTooLargeError) {
    res.status(413).send("The request is too large");
  } else {
    next(err);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is running on port " + port);
});

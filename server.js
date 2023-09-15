const express = require("express");
require("dotenv").config();
const cors = require("cors");

const multer = require("multer");
const app = express();
app.use(cors());
const fs = require("fs");

const upload = multer({ dest: "uploads/" });
const azureStorage = require("azure-storage");
const blobService = azureStorage.createBlobService(
  "DefaultEndpointsProtocol=https;AccountName=zealinbee;AccountKey=jrplFdWzhQpmWMr1hGyWLz3hj6Y1JB2nT8crAwkb3EW0IAHj4cYIS+9TQk/xtU120EXuvKeIJT9S+AStKBy3NA==;EndpointSuffix=core.windows.net"
);

// i will do the env thingy later

app.get("/", (req, res) => {
  res.send("Hi, this is just a test for my image app, the back end should be working!");
});

app.post("/upload", upload.single("myFile"), function (req, res, next) {
  console.log(req.file);
  // Get file name and create read stream
  const blobName = req.file.originalname;
  const stream = fs.createReadStream(req.file.path);

  // Get stream length
  const streamLength = req.file.size;

  // Upload file to Azure Blob Storage
  blobService.createBlockBlobFromStream(
    "images",
    blobName,
    stream,
    streamLength,
    (err) => {
      if (err) {
        // Handle error
        console.error(err);
        res.status(500).send(err);
      } else {
        // If no error, respond with success
        res.status(200).send("File uploaded to Azure Blob Storage.");
      }
    }
  );
});

app.get("/images", async (req, res) => {
  try {
    const images = [];
    blobService.listBlobsSegmented("images", null, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        data.entries.forEach((blob) => {
          const url = blobService.getUrl("images", blob.name);
          images.push(url);
        });
        res.json(images);
      }
    });
  } catch {
    console.error("Error fetching images");
  }
});

const corsOptions = {
  origin: "http://4.245.244.225",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.listen(3000, () => console.log("Server listening on port 3000."));

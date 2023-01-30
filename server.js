const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("./helpers/uuid");

const app = express();
const PORT = process.env || 3000

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) =>
  res.sendFile(psth.join(__dirname, "./public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to post note`);
  console.log(req.body);
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };
    fs.readFile("./db/db.json", (err, data) => {
      const parsedData = JSON.parse(data);
      parsedData.push(newNote);
      fs.writeFile("./db/db.json", JSON.stringify(parsedData, null, 4), (err) =>
        err ? console.error(err) : console.info("Data written to file")
      );
    });
    res.json(parsedData);  }
});

app.delete("/api/notes/:id", (req, res) => {
  fs.readFile("./db/db.json", (err, data) => {
    const parsedData = JSON.parse(data);
    const outputArr = [];
    parsedData.filter((el) => {
      if (el.id !== req.params.id) {
        outputArr.push(el);
      }
    });
    fs.writeFile("./db/db.json", JSON.stringify(outputArr, null, 4), (err) =>
      err ? console.error(err) : console.info("Data written to file")
    );
    res.json(parsedData)
  });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

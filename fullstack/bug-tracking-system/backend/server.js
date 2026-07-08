import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

const bugsFile = path.join(__dirname, "bugs.json");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bug Tracking Backend Running");
});

app.get("/bugs", (req, res) => {
  fs.readFile(bugsFile, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading bugs file" });
    }

    const bugs = JSON.parse(data || "[]");
    res.json(bugs);
  });
});

app.post("/bugs", (req, res) => {
  fs.readFile(bugsFile, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading bugs file" });
    }

    const bugs = JSON.parse(data || "[]");

    const newBug = {
      id: Date.now(),
      title: req.body.title,
      description: req.body.description,
      developer: req.body.developer,
      priority: req.body.priority,
      status: "Open",
      date: new Date().toLocaleString(),
    };

    bugs.push(newBug);

    fs.writeFile(bugsFile, JSON.stringify(bugs, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "Error saving bug" });
      }

      res.status(201).json({
        message: "Bug reported successfully",
        bug: newBug,
      });
    });
  });
});

app.put("/bugs/:id", (req, res) => {
  fs.readFile(bugsFile, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading bugs file" });
    }

    let bugs = JSON.parse(data || "[]");

    const bugIndex = bugs.findIndex(
      (bug) => bug.id === Number(req.params.id)
    );

    if (bugIndex === -1) {
      return res.status(404).json({ message: "Bug not found" });
    }

    bugs[bugIndex].status = req.body.status;

    fs.writeFile(bugsFile, JSON.stringify(bugs, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "Error updating bug" });
      }

      res.json({
        message: "Bug updated successfully",
        bug: bugs[bugIndex],
      });
    });
  });
});

app.delete("/bugs/:id", (req, res) => {
  fs.readFile(bugsFile, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading bugs file" });
    }

    let bugs = JSON.parse(data || "[]");

    bugs = bugs.filter((bug) => bug.id !== Number(req.params.id));

    fs.writeFile(bugsFile, JSON.stringify(bugs, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "Error deleting bug" });
      }

      res.json({ message: "Bug deleted successfully" });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
const express = require("express");
var cors = require("cors");

require("dotenv").config();
const serverless = require("serverless-http");
const { createUser, getUser, updateUserSettings, getUserSettings } = require("./controllers/users");
const { verifyToken } = require("./lib/utils");

const { signInUser } = require("./controllers/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.put("/settings", async function (req, res) {
  try {
    if (!verifyToken(req.headers.authorization)) res.status(400).json({ error: "Not authorized" });

    const response = await updateUserSettings(req.body);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not update settings" });
  }
});

app.get("/settings/:userId", async function (req, res) {
  try {
    if (!verifyToken(req.headers.authorization)) res.status(400).json({ error: "Not authorized" });

    const response = await getUserSettings({ userId: req.params.userId });
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not update settings" });
  }
});

app.get("/users/:userId", async function (req, res) {
  try {
    const response = await getUser({ userId: req.params.userId });
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retrieve user" });
  }
});

app.post("/users", async function (req, res) {
  try {
    const { email, name, password } = req.body;
    const response = await createUser({ email, name, password });
    res.json(response);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error: "Could not create user" });
  }
});

app.post("/auth/signin", async function (req, res) {
  try {
    const { email, password } = req.body;
    console.log({ email, password });
    const response = await signInUser({ email, password });
    res.json(response);
  } catch (error) {
    console.log({ error });
    res.status(400).json({ error: "Could not login" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);

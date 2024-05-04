const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = 3000;

const app = express();

mongoose
  .connect("mongodb://localhost:27017/Users")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(`Error to connecting MongoDb ${err}`);
  });

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to User registration");
});

app.post("/user ", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send("username, email, and password required");
  }
  const newUser = new User({
    username,
    email,
    password,
  });

  try {
    await newUser.save();
    res.status(200).send("registration successful");
  } catch (error) {
    console.log(error);
    res.status(500).send("registration failed");
  }
});


app.put("/user", async (req, res) => {
  const { id, username, email, password } = req.body; 
  if (!id) {
    return res.status(400).send("User ID is required");
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, {
      username,
      email,
      password,
    });
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.status(200).send("User updated successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error updating user");
  }
});


app.delete("/user", async (req, res) => {
  const { id } = req.body; 
  if (!id) {
    return res.status(400).send("User ID is required");
  }

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }
    res.status(200).send("User deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error deleting user");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

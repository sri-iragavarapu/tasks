import path from "path";
import { fileURLToPath } from "url";

import { readData, writeData } from "../utils/fileHelper.js";
import { generateId } from "../utils/generateId.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersFile = path.join(__dirname, "../data/users.json");

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required."
      });
    }

    const users = await readData(usersFile);

    const userExists = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (userExists) {
      return res.status(400).json({
        message: "Email already registered."
      });
    }

    const newUser = {
      id: generateId("U"),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password
    };

    users.push(newUser);

    await writeData(usersFile, users);

    res.status(201).json({
      message: "Registration Successful",
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required."
      });
    }

    const users = await readData(usersFile);

    const user = users.find(
      (user) =>
        user.email.toLowerCase() === email.trim().toLowerCase() &&
        user.password === password
    );

    if (!user) {
      return res.status(401).json({
        message: "Invalid Email or Password."
      });
    }

    res.status(200).json({
      message: "Login Successful",
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};
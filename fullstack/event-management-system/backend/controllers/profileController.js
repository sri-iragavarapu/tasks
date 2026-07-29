import path from "path";
import { fileURLToPath } from "url";

import { readData, writeData } from "../utils/fileHelper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersFile = path.join(__dirname, "../data/users.json");

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const activeUserId = req.userId || userId;

    const users = await readData(usersFile);
    const user = users.find((entry) => entry.id === activeUserId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const { password, ...safeUser } = user;
    res.status(200).json(safeUser);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const activeUserId = req.userId || userId;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required." });
    }

    const users = await readData(usersFile);
    const index = users.findIndex((entry) => entry.id === activeUserId);

    if (index === -1) {
      return res.status(404).json({ message: "User not found." });
    }

    const emailExists = users.find(
      (entry) => entry.email.toLowerCase() === email.trim().toLowerCase() && entry.id !== activeUserId
    );

    if (emailExists) {
      return res.status(400).json({ message: "Email already registered." });
    }

    users[index] = {
      ...users[index],
      name: name.trim(),
      email: email.trim().toLowerCase()
    };

    await writeData(usersFile, users);

    const { password, ...safeUser } = users[index];
    res.status(200).json({ message: "Profile updated successfully.", user: safeUser });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const activeUserId = req.userId || userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required." });
    }

    const users = await readData(usersFile);
    const index = users.findIndex((entry) => entry.id === activeUserId);

    if (index === -1) {
      return res.status(404).json({ message: "User not found." });
    }

    if (users[index].password !== currentPassword) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    users[index].password = newPassword;
    await writeData(usersFile, users);

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
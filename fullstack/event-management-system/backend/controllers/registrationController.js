import path from "path";
import { fileURLToPath } from "url";

import { readData, writeData } from "../utils/fileHelper.js";
import { generateId } from "../utils/generateId.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const registrationsFile = path.join(__dirname, "../data/registrations.json");
const eventsFile = path.join(__dirname, "../data/events.json");

export const registerEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.userId || req.body.userId;

    if (!eventId || !userId) {
      return res.status(400).json({
        message: "Event selection is required."
      });
    }

    const registrations = await readData(registrationsFile);
    const events = await readData(eventsFile);

    const event = events.find((entry) => entry.id === eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    const alreadyRegistered = registrations.find(
      (registration) => registration.eventId === eventId && registration.userId === userId
    );

    if (alreadyRegistered) {
      return res.status(400).json({
        message: "You are already registered for this event."
      });
    }

    if (event.availableSeats <= 0) {
      return res.status(400).json({
        message: "No seats available."
      });
    }

    const today = new Date();
    const deadline = new Date(event.registrationDeadline);

    if (event.status === "Completed" || today > deadline) {
      return res.status(400).json({
        message: "Registration closed for this event."
      });
    }

    const newRegistration = {
      id: generateId("R"),
      eventId,
      userId
    };

    registrations.push(newRegistration);
    event.availableSeats = Math.max(0, event.availableSeats - 1);

    await writeData(registrationsFile, registrations);
    await writeData(eventsFile, events);

    res.status(201).json({
      message: "Registration Successful"
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};

export const getMyRegistrations = async (req, res) => {
  try {
    const { userId } = req.params;
    const activeUserId = req.userId || userId;

    if (!activeUserId) {
      return res.status(401).json({
        message: "Authentication required."
      });
    }

    const registrations = await readData(registrationsFile);
    const events = await readData(eventsFile);

    const myRegistrations = registrations
      .filter((registration) => registration.userId === activeUserId)
      .map((registration) => {
        const event = events.find((entry) => entry.id === registration.eventId);
        return event ? { ...event, registrationId: registration.id } : null;
      })
      .filter(Boolean);

    res.status(200).json(myRegistrations);
  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};

export const cancelRegistration = async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    const activeUserId = req.userId || userId;

    const registrations = await readData(registrationsFile);
    const events = await readData(eventsFile);

    const registrationIndex = registrations.findIndex(
      (registration) => registration.eventId === eventId && registration.userId === activeUserId
    );

    if (registrationIndex === -1) {
      return res.status(404).json({
        message: "Registration not found."
      });
    }

    registrations.splice(registrationIndex, 1);

    const event = events.find((entry) => entry.id === eventId);
    if (event) {
      event.availableSeats = Math.min(event.maxParticipants, event.availableSeats + 1);
    }

    await writeData(registrationsFile, registrations);
    await writeData(eventsFile, events);

    res.status(200).json({
      message: "Registration cancelled successfully."
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};
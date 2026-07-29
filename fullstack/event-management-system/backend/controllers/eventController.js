import path from "path";
import { fileURLToPath } from "url";

import { readData, writeData } from "../utils/fileHelper.js";
import { generateId } from "../utils/generateId.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eventsFile = path.join(__dirname, "../data/events.json");
const registrationsFile = path.join(__dirname, "../data/registrations.json");
const usersFile = path.join(__dirname, "../data/users.json");

const validStatuses = ["Upcoming", "Ongoing", "Completed"];

export const createEvent = async (req, res) => {
  try {
    const {
      eventName,
      description,
      category,
      venue,
      eventDate,
      registrationDeadline,
      maxParticipants,
      status = "Upcoming"
    } = req.body;

    if (
      !eventName ||
      !description ||
      !category ||
      !venue ||
      !eventDate ||
      !registrationDeadline ||
      !maxParticipants
    ) {
      return res.status(400).json({
        message: "All fields are required."
      });
    }

    const parsedMaxParticipants = Number(maxParticipants);
    const eventDateValue = new Date(eventDate);
    const deadlineValue = new Date(registrationDeadline);

    if (Number.isNaN(parsedMaxParticipants) || parsedMaxParticipants <= 0) {
      return res.status(400).json({
        message: "Maximum participants must be a positive number."
      });
    }

    if (Number.isNaN(eventDateValue.getTime()) || Number.isNaN(deadlineValue.getTime())) {
      return res.status(400).json({
        message: "Please provide valid dates."
      });
    }

    if (deadlineValue > eventDateValue) {
      return res.status(400).json({
        message: "Registration deadline cannot be after the event date."
      });
    }

    const events = await readData(eventsFile);

    const newEvent = {
      id: generateId("E"),
      eventName: eventName.trim(),
      description: description.trim(),
      category: category.trim(),
      venue: venue.trim(),
      eventDate,
      registrationDeadline,
      maxParticipants: parsedMaxParticipants,
      availableSeats: parsedMaxParticipants,
      status: validStatuses.includes(status) ? status : "Upcoming"
    };

    events.push(newEvent);

    await writeData(eventsFile, events);

    res.status(201).json({
      message: "Event Created Successfully",
      event: newEvent
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await readData(eventsFile);

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const events = await readData(eventsFile);
    const registrations = await readData(registrationsFile);
    const users = await readData(usersFile);

    const event = events.find((event) => event.id === id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found."
      });
    }

    const eventRegistrations = registrations.filter((registration) => registration.eventId === id);
    const registeredParticipants = eventRegistrations.map((registration) => {
      const user = users.find((entry) => entry.id === registration.userId);
      return user ? { id: user.id, name: user.name, email: user.email } : null;
    }).filter(Boolean);

    res.status(200).json({
      ...event,
      registeredParticipants,
      registeredCount: registeredParticipants.length
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    let events = await readData(eventsFile);
    const registrations = await readData(registrationsFile);

    const eventExists = events.find((event) => event.id === id);

    if (!eventExists) {
      return res.status(404).json({
        message: "Event not found."
      });
    }

    events = events.filter((event) => event.id !== id);
    const remainingRegistrations = registrations.filter((registration) => registration.eventId !== id);

    await writeData(eventsFile, events);
    await writeData(registrationsFile, remainingRegistrations);

    res.status(200).json({
      message: "Event deleted successfully."
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      eventName,
      description,
      category,
      venue,
      eventDate,
      registrationDeadline,
      maxParticipants,
      status
    } = req.body;

    const events = await readData(eventsFile);
    const registrations = await readData(registrationsFile);
    const index = events.findIndex((event) => event.id === id);

    if (index === -1) {
      return res.status(404).json({
        message: "Event not found."
      });
    }

    const parsedMaxParticipants = Number(maxParticipants);
    if (Number.isNaN(parsedMaxParticipants) || parsedMaxParticipants <= 0) {
      return res.status(400).json({
        message: "Maximum participants must be a positive number."
      });
    }

    const currentRegistrations = registrations.filter((registration) => registration.eventId === id).length;
    const availableSeats = Math.max(0, parsedMaxParticipants - currentRegistrations);

    events[index] = {
      ...events[index],
      eventName: eventName.trim(),
      description: description.trim(),
      category: category.trim(),
      venue: venue.trim(),
      eventDate,
      registrationDeadline,
      maxParticipants: parsedMaxParticipants,
      availableSeats,
      status: validStatuses.includes(status) ? status : events[index].status
    };

    await writeData(eventsFile, events);

    res.status(200).json({
      message: "Event updated successfully."
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const events = await readData(eventsFile);
    const registrations = await readData(registrationsFile);

    const dashboard = {
      totalEvents: events.length,
      upcomingEvents: events.filter((event) => event.status === "Upcoming").length,
      ongoingEvents: events.filter((event) => event.status === "Ongoing").length,
      completedEvents: events.filter((event) => event.status === "Completed").length,
      totalRegistrations: registrations.length
    };

    res.status(200).json(dashboard);
  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};
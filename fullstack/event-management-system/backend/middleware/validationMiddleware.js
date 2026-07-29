export const validateAuthPayload = (req, res, next) => {
  const { email, password, name } = req.body;

  if (req.path.includes("register") && (!name || !email || !password)) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  if (req.path.includes("login") && (!email || !password)) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  next();
};

export const validateEventPayload = (req, res, next) => {
  const {
    eventName,
    description,
    category,
    venue,
    eventDate,
    registrationDeadline,
    maxParticipants
  } = req.body;

  if (!eventName || !description || !category || !venue || !eventDate || !registrationDeadline || !maxParticipants) {
    return res.status(400).json({ message: "All event fields are required." });
  }

  next();
};

export const validateProfilePayload = (req, res, next) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required." });
  }

  next();
};

export const validateRegistrationPayload = (req, res, next) => {
  const { eventId } = req.body;

  if (!eventId) {
    return res.status(400).json({ message: "Event selection is required." });
  }

  next();
};
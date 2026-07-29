const authMiddleware = (req, res, next) => {
  const userId = req.headers["x-user-id"] || req.body?.userId || req.params?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Authentication required." });
  }

  req.userId = userId;
  next();
};

export default authMiddleware;
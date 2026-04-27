// Restricts protected routes to admin users.
// Authorizes admin requests; receives Express req/res/next and returns an error response or continues.
const admin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied (admin only)"
    });
  }
  next();
};

module.exports = admin;

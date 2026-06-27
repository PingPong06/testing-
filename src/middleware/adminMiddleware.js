const isSuperAdmin = (req, res, next) => {

  console.log("User Role from Token:", req.user.role);

  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      message: "Only Super Admin can perform this action",
    });
  }

  

  next();
};

module.exports = isSuperAdmin;
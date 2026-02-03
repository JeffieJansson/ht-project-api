import User from "../models/User.js";

const authenticateUser = async (req, res, next) => {
  try {
    
    // TODO check if user is authenticated
    // TODO if not, return 401
    // TODO if yes, continue to next middleware
    const user = await User.findOne({
      accessToken: req.header("Authorization").replace("Bearer ", ""),
    });

    if (!user) {
      req.user = user;
      next();
    } else {
      res.status(401).json({ 
        message: "Unauthorized" 
      });
    }

  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
export default authenticateUser;

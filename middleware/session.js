import jwt from "jsonwebtoken";

// Middleware to check user authorization
export const isAuthorize = (req, res, next) => {
  try {
    // Check if userToken is present in the session
    const userToken = req.session.userToken;
    if (!userToken) {
      // Redirect to login page or return an error response
      return res.redirect("/login"); // Replace with your login route
    }

    // Verify and decode the JWT token
    const decodedToken = jwt.verify(userToken, process.env.JWT_SECRET_TOKEN);

    if (!decodedToken) {
      // Token is invalid or expired, redirect to login
      return res.redirect("/login");
    }

    // User is authenticated, you can attach user information to the request if needed
    req.user = decodedToken; // Assuming your decoded token contains user info
    console.log(decodedToken);
    // Call the next middleware
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    // Handle errors appropriately (e.g., redirect to login or send an error response)
    return res.status(401).redirect("/login");
  }
};

export const isAuth = (req, res, next) => {
  try {
    // Check if userToken is present in the session
    const userToken = req.session.userToken;
    if (!userToken) {
      // Redirect to login page or return an error response
      return next();
    }

    // Verify and decode the JWT token
    const decodedToken = jwt.verify(userToken, process.env.JWT_SECRET_TOKEN);

    if (!decodedToken) {
      // Token is invalid or expired, redirect to login
      return next();
    }

    // User is authenticated, you can attach user information to the request if needed
    req.user = decodedToken; // Assuming your decoded token contains user info
    // Call the next middleware
    return res.redirect("/");
  } catch (error) {
    return res.status(401).redirect("/login");
  }
};

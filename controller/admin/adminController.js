import jwt from "jsonwebtoken";

// Middleware to check admin authorization
export const isAdminAuthorize = (req, res, next) => {
    try {
        // Check if adminToken is present in the session
        const adminToken = req.session.adminToken;
        if (!adminToken) {
          // Redirect to login page or return an error response
          return res.redirect("/admin/login"); // Replace with your login route
        }
    
        // Verify and decode the JWT token
        const decodedToken = jwt.verify(adminToken, process.env.JWT_SECRET_TOKEN);
    
        if (!decodedToken) {
          // Token is invalid or expired, redirect to login
          return res.redirect("/admin/login");
        }
    
        // admin is authenticated, you can attach admin information to the request if needed
        req.admin = decodedToken; // Assuming your decoded token contains admin info
        // Call the next middleware
        next();
      } catch (error) {
        console.error("Authorization error:", error);
        // Handle errors appropriately (e.g., redirect to login or send an error response)
        return res.status(401).redirect("/admin/login");
      }
};
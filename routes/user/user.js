import express from "express";

// Import your controller functions or middleware
import {
  getAboutPage,
  // getBlogDetailsPage,
  // getBlogUpdatesPage,
  getContactPage,
  getHomePage,
  getLoginPage,
  getOfferSubmit,
  getOffersPage,
  getRegisterPage,
  getSingleOfferPage,
  postUserLogin,
  postUserRegister,
} from "../../controller/user/userController.js";
import { isAuthorize, isAuth } from "../../middleware/session.js";

// Create a router instance
const router = express.Router();

// Define routes and associate them with corresponding controller functions
router.get("/", getHomePage);
router.route("/login").get(isAuth, getLoginPage).post(postUserLogin);
router.route("/register").get(getRegisterPage).post(postUserRegister);
router.get("/about", isAuthorize, getAboutPage);
router.get("/contact", isAuthorize, getContactPage);
router.get("/offers", isAuthorize, getOffersPage);
// router.get("/blog-updates", getBlogUpdatesPage);
// router.get("/blog-details", getBlogDetailsPage);
router.get("/offers-details/:id", getSingleOfferPage);
router.get("/offer-submission", isAuthorize, getOfferSubmit);

// Export the router
export default router;

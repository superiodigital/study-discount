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
  getSuggestions,
  postUserLogin,
  postUserRegister,
  searchOffers,
} from "../../controller/user/userController.js";
import { isAuthorize, isAuth } from "../../middleware/session.js";
import { postRegisterOffer } from "../../controller/user/offerController.js";

// Create a router instance
const router = express.Router();

// Define routes and associate them with corresponding controller functions
router.get("/", getHomePage);
router.route("/login").get(isAuth, getLoginPage).post(postUserLogin);
router.route("/register").get(isAuth, getRegisterPage).post(postUserRegister);
router.get("/about", getAboutPage);
router.get("/contact", getContactPage);
router.get("/offers", getOffersPage);
// router.get("/blog-updates", getBlogUpdatesPage);
// router.get("/blog-details", getBlogDetailsPage);
router.get("/offers-details/:offerSlug", getSingleOfferPage);
router.get("/offer-submission", getOfferSubmit);
router.post("/offers-registration", postRegisterOffer);

router.post('/search',searchOffers);
router.get('/getSuggestions',getSuggestions)

// Export the router
export default router;

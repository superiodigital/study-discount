import express from "express";

// Import your controller functions or middleware
import {
  getAboutPage,
  // getBlogDetailsPage,
  // getBlogUpdatesPage,
  getContactPage,
  getFaqStudyAbroadPage,
  getFaqStudyDIscountPage,
  getHomePage,
  getOfferSubmit,
  getOffersPage,
  getSingleOfferPage,
  getSuggestions,
  getTermsAndConditions,
  searchOffers,
} from "../../controller/user/userController.js";
import { isAuthorize, isAuth } from "../../middleware/session.js";
import { postRegisterOffer } from "../../controller/user/offerController.js";
import { getLoginPage, getRegisterPage, postUserLogin, postUserRegister } from "../../controller/user/authController.js";

// Create a router instance
const router = express.Router();

// Define routes and associate them with corresponding controller functions
router.get("/", getHomePage); // route to home page

router.route("/login").get(isAuth, getLoginPage).post(postUserLogin); // route to login page
router.route("/register").get(isAuth, getRegisterPage).post(postUserRegister); // route to register

router.get("/about", getAboutPage); // route to about page
router.get("/contact", getContactPage);
router.get("/offers", getOffersPage);
// router.get("/blog-updates", getBlogUpdatesPage);
// router.get("/blog-details", getBlogDetailsPage);
router.get("/offers-details/:offerSlug", getSingleOfferPage);
router.get("/offer-submission", getOfferSubmit);
router.post("/offers-registration", postRegisterOffer);

router.get('/faq-study-discount', getFaqStudyDIscountPage);
router.get('/faq-study-abroad', getFaqStudyAbroadPage);

router.post('/search', searchOffers);
router.get('/getSuggestions', getSuggestions)
router.get('/terms-and-conditions', getTermsAndConditions)

// Export the router
export default router;

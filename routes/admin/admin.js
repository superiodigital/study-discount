import express from "express";
import { getAdminHome, getAdminLogin, getCompanyUpdatesPage, postAdminLogin } from "../../controller/admin/adminController.js";
import { deleteOfferFun, getAddOfferForm, getOfferManager } from "../../controller/admin/offerController.js";
import { deleteBannerFun, getAddBannerPage, getBannerManger, postAddBanners } from "../../controller/admin/bannerController.js";
import { isAdminAuthorize } from '../../middleware/admin-authorize.js'
import { multerMiddleware } from "../../middleware/multer.js"
const router = express.Router();

// basic routes
router.get("/", isAdminAuthorize, getAdminHome);
router.route("/login",).get(getAdminLogin).post(postAdminLogin);

// offer routes
router.get("/offers", isAdminAuthorize, getOfferManager);
router.route("/add-offers").get(isAdminAuthorize, getAddOfferForm).post(multerMiddleware.single('file'))
router.delete('/delete-offer/:offerId', deleteOfferFun)

//banner routes
router.get("/banners", isAdminAuthorize, getBannerManger);
router.route("/add-banners").get(isAdminAuthorize, getAddBannerPage).post(multerMiddleware.single('file'), postAddBanners)
router.delete('/delete-banner/:bannerId', deleteBannerFun)

// blog routes
router.get("/company-updates", isAdminAuthorize, getCompanyUpdatesPage);

export default router

import express from "express";
import { getAdminHome, getAdminLogin, getCompanyUpdatesPage, postAdminLogin } from "../../controller/admin/adminController.js";
import { deleteOfferFun, getAddOfferForm, getEditOfferForm, getOfferManager, postAddOfferForm, postEditOfferForm } from "../../controller/admin/offerController.js";
import { deleteBannerFun, getAddBannerPage, getBannerManger, postAddBanners } from "../../controller/admin/bannerController.js";
import { isAdminAuthorize } from '../../middleware/admin-authorize.js'
import { multerMiddleware } from "../../middleware/multer.js"
const router = express.Router();
// basic routes
router.get("/", isAdminAuthorize, getAdminHome);
router.route("/login",).get(getAdminLogin).post(postAdminLogin);

// offer routes
router.get("/offers", getOfferManager);
router.route("/add-offers").get(getAddOfferForm).post(multerMiddleware.single('file'), postAddOfferForm);
router.route('/edit-offer/:offerId').get(getEditOfferForm).post(multerMiddleware.single('file'),postEditOfferForm)
router.delete('/delete-offer/:offerId', deleteOfferFun)

//banner routes
router.get("/banners", getBannerManger);
router.route("/add-banners").get(getAddBannerPage).post(multerMiddleware.single('file'), postAddBanners)
router.delete('/delete-banner/:bannerId', deleteBannerFun)

// blog routes
router.get("/company-updates", getCompanyUpdatesPage);

export default router

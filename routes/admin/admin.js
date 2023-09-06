import express from "express";
import { getAdminHome, getAdminLogin, getCompanyUpdatesPage, postAdminLogin } from "../../controller/admin/adminController.js";
import { deleteOfferFun, getAddOfferForm, getEditOfferForm, getOfferManager, postAddOfferForm, postEditOfferForm } from "../../controller/admin/offerController.js";
import { deleteBannerFun, getAddBannerPage, getBannerManger, getEditBannerForm, postAddBanners, postEditBannerForm } from "../../controller/admin/bannerController.js";
import { isAdminAuthorize } from '../../middleware/admin-authorize.js'
import { multerMiddleware } from "../../middleware/multer.js"
import { getDownloadLeads, getOfferLeadTable } from "../../controller/admin/offerLeadsController.js";
const router = express.Router();
// basic routes
router.get("/", isAdminAuthorize, getAdminHome);
router.route("/login",).get(getAdminLogin).post(postAdminLogin);

// offer routes
router.get("/offers", isAdminAuthorize, getOfferManager);
router.route("/add-offers").get(isAdminAuthorize, getAddOfferForm).post(multerMiddleware.single('file'), postAddOfferForm);
router.route('/edit-offer/:offerId').get(isAdminAuthorize, getEditOfferForm).post(multerMiddleware.single('file'), postEditOfferForm)
router.delete('/delete-offer/:offerId', deleteOfferFun)

//banner routes
router.get("/banners", isAdminAuthorize, getBannerManger);
router.route("/add-banners").get(getAddBannerPage).post(multerMiddleware.single('file'), postAddBanners)
router.delete('/delete-banner/:bannerId', deleteBannerFun)
router.route('/edit-banner/:bannerId').get(isAdminAuthorize, getEditBannerForm).post(multerMiddleware.single('file'), postEditBannerForm)


// blog routes
router.get("/company-updates", isAdminAuthorize, getCompanyUpdatesPage);

// offer lead routes
router.get('/download-offer', getDownloadLeads)
router.get('/offerLeads-table', getOfferLeadTable)

export default router

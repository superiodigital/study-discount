import express from "express";
import { getAdminHome, getAdminLogin, getCompanyUpdatesPage, postAdminLogin } from "../../controller/admin/adminController.js";
import { deleteOfferFun, getAddOfferForm, getEditOfferForm, getOfferManager, postAddOfferForm, postEditOfferForm } from "../../controller/admin/offerController.js";
import { deleteBannerFun, getAddBannerPage, getBannerManger, getEditBannerForm, postAddBanners, postEditBannerForm } from "../../controller/admin/bannerController.js";
import { isAdminAuthorize } from '../../middleware/admin-authorize.js'
import { multerMiddleware } from "../../middleware/multer.js"
import { deleteLeadsLogs, getDownloadLeads, getLeadsLogs, getOfferLeadTable, putOfferLeadDisable, putOfferLeadEnable } from "../../controller/admin/offerLeadsController.js";
import { deleteCategoriesFun, getAddCategories, getCategoryManage, getEditCategoryForm, postAddCategories, postEditCategoryForm } from "../../controller/admin/categoryController.js";
import { deleteFaqManager, getAddFaqManager, getEditFaqManager, getFaqManager, postAddFaqManager, postEditFaqManager } from "../../controller/admin/faqController.js";
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

//category routes
router.get('/categories', getCategoryManage)
router.route("/add-categories").get(isAdminAuthorize, getAddCategories).post(multerMiddleware.single('file'), postAddCategories);
router.delete('/delete-category/:categoryId', isAdminAuthorize, deleteCategoriesFun)
router.route('/edit-category/:categoryId').get(isAdminAuthorize, getEditCategoryForm).post(multerMiddleware.single('file'), postEditCategoryForm)

// FAQ routes
router.get('/faq-manager', isAdminAuthorize, getFaqManager)
router.route('/add-faq').get(isAdminAuthorize, getAddFaqManager).post(isAdminAuthorize, postAddFaqManager)
router.delete('/delete-faq/:faqId', isAdminAuthorize, deleteFaqManager)
router.route('/edit-faq/:faqId').get(isAdminAuthorize, getEditFaqManager).post(isAdminAuthorize, postEditFaqManager)

// blog routes
router.get("/company-updates", isAdminAuthorize, getCompanyUpdatesPage);

// offer lead routes
router.get('/download-offer', isAdminAuthorize, getDownloadLeads)
router.get('/offerLeads-table', isAdminAuthorize, getOfferLeadTable)
router.put('/move-to-bin/:leadId', isAdminAuthorize, putOfferLeadDisable)
router.put('/recycle-lead/:leadId', isAdminAuthorize, putOfferLeadEnable)
router.get('/leads-logs', isAdminAuthorize, getLeadsLogs)
router.delete('/delete-lead/:leadId', isAdminAuthorize, deleteLeadsLogs)



// router.get('/test', (req, res) => {
//     res.render('test', { layout: 'admin-layout' })
// })

// router.post('/save', multerMiddleware.single('file'), (req, res) => {
//     console.log(req.body)
// })

export default router

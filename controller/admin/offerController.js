import Category from "../../models/schema/categorySchema.js";
import Offer from "../../models/schema/offersSchema.js"
import fs from 'fs/promises';


export const getOfferManager = async (req, res) => {
    try {
        const offers = await Offer.find().lean();
        // Format the date strings in the offers array
        offers.forEach((offer) => {
            offer.expiresFrom = new Date(offer.expiresFrom).toLocaleDateString('en-GB');
            offer.expiresTo = new Date(offer.expiresTo).toLocaleDateString('en-GB');
        });
        res.render('admin/offers-manager', { layout: 'admin-layout', offers });
    } catch (error) {
        res.status(500).send(error);
    }
}

export const getAddOfferForm = async (req, res) => {
    try {
        const categories = await Category.find().lean().select('name')
        res.render('admin/add-offer', { layout: 'admin-layout', categories })
    } catch (error) {
        res.status(500).send(error)
    }
}

export const postAddOfferForm = async (req, res) => {
    try {
        // Extract form data
        const { name, slug, category, shortDescription, fromTo, offerPrice, realPrice, offerPercent, content: longDescription, type } = req.body;

        // Access the new name of the uploaded offer image
        const newFileName = req.file.filename;

        // Split the fromTo date range into expiresFrom and expiresTo
        const [expiresFrom, expiresTo] = fromTo.split(' to ');
        const slugExist = await Offer.findOne({ slug: slug });
        let slugConfirm = slug;
        if (slugExist) {
            // Handle duplicate slug here, maybe by appending a unique identifier
            slugConfirm = `${slug}=${Date.now()}`;
        }
        // Create a new Offer document
        const newOffer = new Offer({
            name,
            slug: slugConfirm,
            longDescription,
            shortDescription,
            category,
            expiresFrom, // Add expiresFrom field
            type,
            expiresTo,   // Add expiresTo field
            offerPrice, realPrice, offerPercent,
            offerImage: newFileName, // Assuming your Offer model has an 'offerImage' field for the image name
        });

        // Save the offer to the database
        await newOffer.save();
        res.status(201).json({ success: true });
        // res.status(201).redirect('/admin/offers')
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


export const deleteOfferFun = async (req, res) => {
    try {
        const { offerId } = req.params;
        const offer = await Offer.findById(offerId);

        if (!offer) {
            return res.status(404).json({ status: false, error: 'offer not found' });
        }

        // Get the filename associated with the offer
        const filename = offer.offerImage;

        // Remove the offer from the database
        await Offer.findByIdAndDelete(offerId);

        // Remove the file from the uploads folder
        await fs.unlink(`public/uploads/${filename}`);

        res.status(200).json({ status: true, message: 'offer deleted successfully' });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ status: false, error: 'Server error' });
    }
}

export const postEditOfferForm = async (req, res) => {
    try {
        const { offerId } = req.params
        const { shortDescription, content: longDescription, fromTo, offerPrice, realPrice, offerPercent, name, slug, category, type } = req.body;
        const offer = await Offer.findById(offerId)
        if (!offer) {
            res.status(404).send('not fount ')
        }
        offer.name = name
        offer.slug = slug
        offer.shortDescription = shortDescription
        offer.longDescription = longDescription
        offer.offerPrice = offerPrice
        offer.realPrice = realPrice
        offer.offerPercent = offerPercent
        offer.type = type
        if (category !== '') {
            offer.category = category
        }
        if (req.file?.filename) {
            await fs.unlink(`public/uploads/${offer.offerImage}`);
            offer.offerImage = req.file.filename
        }
        if (fromTo !== '') {
            const [expiresFrom, expiresTo] = fromTo.split(' to ');
            offer.expiresFrom = expiresFrom
            offer.expiresTo = expiresTo
        }
        offer.save()
        res.status(201).json({ success: true })
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: 'Server error' });
    }
}

export const getEditOfferForm = async (req, res) => {
    try {
        const { offerId } = req.params
        const offer = await Offer.findById(offerId).lean()
        offer.expiresFrom = new Date(offer.expiresFrom).toLocaleDateString('en-GB');
        offer.expiresTo = new Date(offer.expiresTo).toLocaleDateString('en-GB');
        const categories = await Category.find().lean().select('name')
        res.render('admin/edit-offer', { layout: 'admin-layout', offer, categories })
    } catch (error) {
        res.status(500).json({ status: false, error: 'Server error' });
    }
}


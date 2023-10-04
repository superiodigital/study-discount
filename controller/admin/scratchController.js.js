import ScratchCard from "../../models/schema/scratchSchema.js";
import fs from 'fs/promises';
import Offer from "../../models/schema/offersSchema.js";

export const getAddScratchGift = async (req, res) => {
    try {
        const offerNames = await Offer.find({}).select('name').lean()
        res.render('admin/add-scratch-gift', { layout: 'admin-layout' ,offerNames})
    } catch (error) {
        res.status(500).send(error)
    }
}

export const getScratchCardManager = async (req, res) => {
    try {
        const scratchGifts = await ScratchCard.find({}).lean()
        res.render('admin/scratch-card-manager', { layout: 'admin-layout', scratchGifts })
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}

export const deleteScratchCardGift = async (req, res) => {
    try {
        const { scratchGiftsId } = req.params;
        const scratchGifts = await ScratchCard.findById(scratchGiftsId);

        if (!scratchGifts) {
            return res.status(404).json({ status: false, error: 'ScratchCard not found' });
        }

        // Get the filename associated with the scratchGifts
        const filename = scratchGifts.image;

        // Remove the scratchGifts from the database
        await ScratchCard.findByIdAndDelete(scratchGiftsId);

        // Remove the file from the uploads folder
        await fs.unlink(`public/uploads/${filename}`);

        res.status(200).json({ status: true, message: 'ScratchCard deleted successfully' });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ status: false, error: 'Server error' });
    }
}

export const postAddScratchGift = async (req, res) => {
    try {
        const { message } = req.body;
        const imageUrl = req.file.filename; // Assuming you have middleware set up for file uploads
        const offerIdArray = req.body.offerIdArray; // Assuming offerIdArray is part of the request body

        const newScratchGifts = new ScratchCard({
            winMessage: message,
            image: imageUrl,
            offerIdArray: Array.isArray(offerIdArray) ? offerIdArray : [offerIdArray]
        });
        await newScratchGifts.save();

        res.status(201).redirect('/admin/scratch-card-manager');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

export const getEditScratchGift = async (req, res) => {
    try {
        const { scratchGiftsId } = req.params
        const scratchGifts = await ScratchCard.findById(scratchGiftsId).lean();
        res.render('admin/edit-scratch-gift', { layout: 'admin-layout', scratchGifts })
    } catch (error) {
        res.status(500).send(error)
    }
}

export const postEditScratchGift = async (req, res) => {
    try {
        const { scratchGiftsId } = req.params
        const { message } = req.body;

        const scratchGifts = await ScratchCard.findById(scratchGiftsId)
        if (!scratchGifts) {
            res.status(404).send('not fount ')
        }
        scratchGifts.winMessage = message
        if (req.file?.filename) {
            await fs.unlink(`public/uploads/${scratchGifts.image}`);
            scratchGifts.image = req.file.filename
        }
        scratchGifts.save()
        res.redirect('/admin/scratch-card-manager')
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: 'Server error' });
    }
}

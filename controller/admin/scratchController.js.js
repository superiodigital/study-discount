import ScratchCard from "../../models/schema/scratchSchema.js";
import fs from 'fs/promises';
import Offer from "../../models/schema/offersSchema.js";
import CommonSettings from "../../models/schema/commonSchema.js";
import ScratchWinner from "../../models/schema/scratchWinnersSchema.js";

export const getEnableScratchCardRoutes = async (req, res) => {
    try {
        // Find the CommonSettings document
        const settings = await CommonSettings.findOne();

        // If the settings document is found, toggle the scratchCard property
        if (settings) {
            settings.scratchCard = !settings.scratchCard;

            // Save the updated settings document
            await settings.save();

            // Return the updated settings in the response
            res.status(200).json({ status: true });
        } else {
            // If no settings document is found, return an error response
            res.status(404).json({ message: 'CommonSettings document not found' });
        }
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}


export const getAddScratchGift = async (req, res) => {
    try {
        const offerNames = await Offer.find({}).select('name').lean()
        res.render('admin/add-scratch-gift', { layout: 'admin-layout', offerNames })
    } catch (error) {
        res.status(500).send(error)
    }
}

export const getScratchCardManager = async (req, res) => {
    try {
        const settings = await CommonSettings.findOne().lean()
        const scratchGifts = await ScratchCard.find({}).lean()
        res.render('admin/scratch-card-manager', { layout: 'admin-layout', scratchGifts, settings })
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
        const { message, name, priority } = req.body;
        const imageUrl = req.file.filename; // Assuming you have middleware set up for file uploads
        const offerIdArray = req.body.offerIdArray; // Assuming offerIdArray is part of the request body

        const newScratchGifts = new ScratchCard({
            name,
            winMessage: message,
            image: imageUrl,
            priority: Number(priority),
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
        const { scratchGiftsId: giftId } = req.params
        const gift = await ScratchCard.findById(giftId).lean();
        const offerNames = await Offer.find({}).select('name').lean()
        res.render('admin/edit-scratch-gift', { layout: 'admin-layout', gift, offerNames })
    } catch (error) {
        res.status(500).send(error)
    }
}

export const postEditScratchGift = async (req, res) => {
    try {
        const { scratchGiftsId } = req.params
        const { message, name, priority } = req.body;

        const scratchGifts = await ScratchCard.findById(scratchGiftsId)
        if (!scratchGifts) {
            res.status(404).send('not fount ')
        }
        scratchGifts.name = name
        scratchGifts.priority = Number(priority)
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

export const getScratchWinnersManager = async (req, res) => {
    try {
        const scratchWinners = await ScratchWinner.find({}).populate('userId offerId giftId')
        // Extract username, offerName, and giftName
        const extractedData = scratchWinners.map(item => ({
            _id: item._id,
            userName: item.userId.username,
            offerName: item.offerId.name,
            giftName: item.giftName,
        }));
        res.render('admin/scratch-winners-manager', { layout: 'admin-layout', winners: extractedData })
    } catch (error) {

    }
}
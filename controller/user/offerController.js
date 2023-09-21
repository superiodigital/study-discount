import { trusted } from 'mongoose';
import OfferLead from '../../models/schema/offerLeads.js';
import Offer from '../../models/schema/offersSchema.js'

export const postRegisterOffer = async (req, res) => {
    try {
        const { name, email, phone, offerId, isTermsAccepted } = req.body
        const accepted = isTermsAccepted === 'on' ? true : false
        const newOffer = new OfferLead({
            name, email, phone, offerId,
            isPolicyAccept: accepted
        })
        await newOffer.save()
        res.status(200).json({ status: true })
    } catch (error) {
        console.log(error);
    }
}
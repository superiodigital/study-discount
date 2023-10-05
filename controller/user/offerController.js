import OfferLead from '../../models/schema/offerLeads.js';
import Offer from '../../models/schema/offersSchema.js'
import ScratchCard from '../../models/schema/scratchSchema.js';
import { signUpWhileRegister } from './authController.js';

export const postRegisterOffer = async (req, res) => {
    try {
        const { name, email, phone, offerId, isTermsAccepted } = req.body
        const accepted = isTermsAccepted === 'on' ? true : false
        const newOffer = new OfferLead({
            name, email, phone, offerId,
            isPolicyAccept: accepted,
        })
        if (req.body.giftId) {
            newOffer.gifts.push(req.body.giftId)
        }
        await newOffer.save()
        const userSignup = await signUpWhileRegister(req.session.userToken, { name, email, phone })
        if (userSignup.userRegistered) {
            req.session.userToken = userSignup.token
            res.status(200).json({ status: true })
        } else {
            res.status(200).json({ status: true })
        }
    } catch (error) {
        console.log(error);
    }
}
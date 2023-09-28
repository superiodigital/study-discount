import { trusted } from 'mongoose';
import OfferLead from '../../models/schema/offerLeads.js';
import Offer from '../../models/schema/offersSchema.js'
import { signUpWhileRegister } from './authController.js';

export const postRegisterOffer = async (req, res) => {
    try {
        const { name, email, phone, offerId, isTermsAccepted } = req.body
        const accepted = isTermsAccepted === 'on' ? true : false
        const newOffer = new OfferLead({
            name, email, phone, offerId,
            isPolicyAccept: accepted
        })
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
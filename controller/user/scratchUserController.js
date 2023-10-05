import jwt from "jsonwebtoken";
import User from "../../models/schema/userSchema.js";
import ScratchCard from "../../models/schema/scratchSchema.js";
import mongoose from "mongoose";

export const postAddScratchToUserList = async (req, res) => {
    try {
        const { offerId, giftId, userId: userToken } = req.body;
        const decodedToken = jwt.verify(userToken, process.env.JWT_SECRET_TOKEN);
        const user = await User.findOne({ _id: decodedToken.userId });

        // Check if the object with the same offerId and giftId already exists in the array
        const existingObjectIndex = user.scratchCardArray.findIndex(
            (obj) => obj.offerId == offerId && obj.giftId == giftId
        );
        if (existingObjectIndex === -1) {
            // Object doesn't exist, so add it to the array
            user.scratchCardArray.push({ offerId, giftId });
            await user.save();
            res.status(200).json({ message: 'Object added to the array' });
        } else {
            // Object already exists, send a message or handle as needed
            res.status(400).json({ message: 'Object already exists in the array' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const handleExistScratchGIft = async (userToken, details) => {
    try {
        // Verify and decode the user token
        const decodedToken = jwt.verify(userToken, process.env.JWT_SECRET_TOKEN);
        // Find the user based on the decoded token
        const user = await User.findById(decodedToken.userId);
        if (!user) {
            return { userNotFound: true };
        }
        // Find the index of the matching offerId in the scratchCardArray
        const findIndex = user.scratchCardArray.findIndex(gift => gift.offerId.toString() === details.offerId.toString());
        if (findIndex !== -1) {
            // Retrieve the gift object based on the index
            const giftObj = user.scratchCardArray[findIndex];
            const gift = await ScratchCard.findById(giftObj.giftId).lean()
            if (!gift) {
                return { giftNotFound: true }; 
            }
            // Return the gift object or any other data you need
            return { gift: gift, giftExist: true };
        } else {
           const gift = await ScratchCard.find({
                offerIdArray: {
                    $elemMatch: {
                        $eq: details.offerId.toString()
                    }
                }
            }).lean()
            const randomIndex = Math.floor(Math.random() * gift?.length);
            return { gift: gift[randomIndex], giftExist: false };
        }
    } catch (error) {
        console.error("Error:", error);
        // Handle the error appropriately, e.g., return an error response
        return { error: "An error occurred" };
    }

}
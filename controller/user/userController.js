import Banner from '../../models/schema/bannerSchema.js'
import OfferLead from '../../models/schema/offerLeads.js'
import Offer from '../../models/schema/offersSchema.js'
import FAQ from "../../models/schema/faqSchema.js";
import TermsAndConditions from '../../models/schema/termsAndConditions.js'

export const getHomePage = async (req, res) => {
    try {
        const banners = await Banner.find().lean()
        const randomIndex = Math.floor(Math.random() * banners?.length);
        const randomBanner = banners[randomIndex]

        const offers = (await Offer.find().lean().sort()).reverse()

        const featuredOffers = (await Offer.find().lean().sort()).reverse()
        featuredOffers.forEach((offer, i) => {
            if (i < 3) {
                offer.expiresFrom = new Date(offer.expiresFrom).toLocaleDateString('en-GB');
                offer.expiresTo = new Date(offer.expiresTo).toLocaleDateString('en-GB');
            }
        });

        // Format the date strings in the offers array
        offers.forEach(async (offer) => {
            offer.expiresFrom = new Date(offer.expiresFrom).toLocaleDateString('en-GB');
            offer.expiresTo = new Date(offer.expiresTo).toLocaleDateString('en-GB');
            const countOfRegistrations = await OfferLead.countDocuments({ offerId: offer._id })
            offer.registrations = countOfRegistrations
            if (offer.offerPercent === 0) {
                delete offer.offerPercent
            }
        });

        const offersCategory = await Offer.find().populate('category').select('category').lean()

        let filteredCategory = []
        let categoryForFilter = offersCategory.map((cat, i) => {
            const index = filteredCategory.findIndex((c) => c._id === cat.category._id)
            if (index === -1) {
                filteredCategory.push(cat.category)
                return
            }
        })

        // Sort the array by the 'name' property in ascending order
        filteredCategory.sort((a, b) => {
            const nameA = a.name.toUpperCase(); // Convert names to uppercase for case-insensitive sorting
            const nameB = b.name.toUpperCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });
        res.render('index', { randomBanner, offers, homePage: true, filteredCategory, featuredOffers })
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}

export const getAboutPage = async (req, res) => {
    try {
        res.render('about', { aboutPage: true })
    } catch (error) {
        res.status(500).send(error)
    }
}

export const getContactPage = async (req, res) => {
    try {
        res.render('contact', { contactPage: true })
    } catch (error) {
        res.status(500).send(error)
    }
}

export const getOffersPage = async (req, res) => {
    try {
        const offers = (await Offer.find().lean().sort()).reverse()
        const featuredOffers = (await Offer.find().lean().limit(3).sort()).reverse()
        // Format the date strings in the offers array
        offers.forEach(async (offer) => {
            offer.expiresFrom = new Date(offer.expiresFrom).toLocaleDateString('en-GB');
            offer.expiresTo = new Date(offer.expiresTo).toLocaleDateString('en-GB');
            const countOfRegistrations = await OfferLead.countDocuments({ offerId: offer._id })
            offer.registrations = countOfRegistrations
            if (offer.offerPercent === 0) {
                delete offer.offerPercent
            }
        });
        // Format the date strings in the offers array
        featuredOffers.forEach((offer) => {
            offer.expiresFrom = new Date(offer.expiresFrom).toLocaleDateString('en-GB');
            offer.expiresTo = new Date(offer.expiresTo).toLocaleDateString('en-GB');
        });
        const offersCategory = await Offer.find().populate('category').select('category').lean()

        let filteredCategory = []
        let categoryForFilter = offersCategory.map((cat, i) => {
            const index = filteredCategory.findIndex((c) => c._id === cat.category._id)
            if (index === -1) {
                filteredCategory.push(cat.category)
                return
            }
        })

        // Sort the array by the 'name' property in ascending order
        filteredCategory.sort((a, b) => {
            const nameA = a.name.toUpperCase(); // Convert names to uppercase for case-insensitive sorting
            const nameB = b.name.toUpperCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });
        res.render('offers', { offerPage: true, offers, filteredCategory, featuredOffers })
    } catch (error) {
        res.status(500).send(error)
    }
}

export const getSingleOfferPage = async (req, res) => {
    try {
        const { offerSlug } = req.params
        const changeOfferViewCount = await Offer.findOne({ slug: offerSlug })
        if (!changeOfferViewCount) {
            return res.status(404).render('not-found-404', { notFound: true })
        }
        changeOfferViewCount.viewedCount += 1
        await changeOfferViewCount.save()
        // finding offer
        const offer = await Offer.findOne({ slug: offerSlug }).lean()
        if (!offer) {
            return res.status(404).render('not-found-404', { notFound: true })
        }
        const relatedOffers = await Offer.find({
            $and: [
                { category: offer.category },
                { _id: { $ne: offer._id } }
            ]
        }).lean();
        relatedOffers.forEach((offer) => {
            offer.expiresFrom = new Date(offer.expiresFrom).toLocaleDateString('en-GB');
            offer.expiresTo = new Date(offer.expiresTo).toLocaleDateString('en-GB');
        });
        const registeredCount = await OfferLead.countDocuments({ offerId: offer._id })
        res.render('offer-details', { offer, relatedOffers, registeredCount });
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}

export const getOfferSubmit = async (req, res) => {
    try {
        res.render('offer-submit')
    } catch (error) {
        res.status(500).send(error)
    }
}

export const searchOffers = async (req, res) => {
    const selectedCategory = req.body.category; // Assuming you send the selected category as a POST parameter
    const keyword = req.body.keyword; // Assuming you send the keyword as a POST parameter
    try {
        let results;

        // If a category is selected, search by category
        if (selectedCategory) {
            results = await Offer.find({ category: selectedCategory }).lean()
        } else {
            // If no category is selected, search by keyword across the "offers" collection
            results = await Offer.find({
                $or: [
                    { shortDescription: { $regex: keyword, $options: 'i' } }, // Case-insensitive keyword search on 'name' field
                    { longDescription: { $regex: keyword, $options: 'i' } }, // Add more fields to search if needed
                    { name: { $regex: keyword, $options: 'i' } }, // Add more fields to search if needed
                ],
            }).lean()
        }
        results.forEach((offer) => {
            offer.expiresFrom = new Date(offer.expiresFrom).toLocaleDateString('en-GB');
            offer.expiresTo = new Date(offer.expiresTo).toLocaleDateString('en-GB');
        });
        res.render('offers', { offerPage: true, offers: results })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getSuggestions = async (req, res) => {
    const keyword = req.query.keyword;

    try {
        // Fetch suggestions based on the keyword (you can customize this query)
        const suggestions = await Offer.find({
            $or: [
                { shortDescription: { $regex: keyword, $options: 'i' } }, // Case-insensitive keyword search on 'name' field
                { longDescription: { $regex: keyword, $options: 'i' } }, // Add more fields to search if needed
                { name: { $regex: keyword, $options: 'i' } }, // Add more fields to search if needed
            ],
        }).limit(5); // Limit the number of suggestions

        // Extract the relevant data for suggestions
        const suggestionData = suggestions.map((offer) => ({
            id: offer._id, // Assuming your offers have unique IDs
            name: offer.name,
            shortDescription: offer.shortDescription,
            slug: offer.slug
        }));
        res.json(suggestionData);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getTermsAndConditions = async (req, res) => {
    try {
        const termAndConditions = await TermsAndConditions.find({}).lean()
        res.render('terms-and-conditions', { termAndConditions })
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getFaqStudyAbroadPage = async (req, res) => {
    try {
        const faqs = await FAQ.find({ category: 'study-abroad' }).lean()
        res.render('FAQs', { FAQ: true, faqs, studyAbroad: true })
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getFaqStudyDIscountPage = async (req, res) => {
    try {
        const faqs = await FAQ.find({ category: 'study-discount' }).lean()
        res.render('FAQs', { FAQ: true, faqs, studyDiscount: true })
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}


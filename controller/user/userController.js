import Banner from '../../models/schema/bannerSchema.js'
import Offer from '../../models/schema/offersSchema.js'
import User from '../../models/schema/userSchema.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const getHomePage = async (req, res) => {
    try {
        const banners = await Banner.find().lean()
        const randomIndex = Math.floor(Math.random() * banners?.length);

        const randomBanner = banners[randomIndex]

        const offers = await Offer.find().lean();
        // Format the date strings in the offers array
        offers.forEach((offer) => {
            offer.expiresFrom = new Date(offer.expiresFrom).toLocaleDateString('en-GB');
            offer.expiresTo = new Date(offer.expiresTo).toLocaleDateString('en-GB');
        });
        res.render('index', { randomBanner, offers, homePage: true })
    } catch (error) {
        res.status(500).send(error)
    }
}

export const getLoginPage = async (req, res) => {
    res.render('login')
}

export const postUserLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                const token = jwt.sign(
                    { userId: user._id },
                    process.env.JWT_SECRET_TOKEN,
                    {
                        expiresIn: "1h",
                    }
                );

                // Store the token in the session cookie
                req.session.userToken = token;

                // Save the token in a regular cookie
                res.cookie("token", token, {
                    httpOnly: true, // The cookie cannot be accessed by JavaScript
                    secure: process.env.NODE_ENV === "production", // Use secure cookies in production (HTTPS)
                    maxAge: 3600000, // Session expiration time (1 hour)
                });
                res.status(200).json({
                    success: true,
                    message: "user logged",
                });
            } else {
                res.status(401).json({ success: false, message: "Invalid credentials" });
            }
        }
        else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const getRegisterPage = async (req, res) => {
    try {
        res.render('register')
    } catch (error) {
        res.status(500).send(error)
    }
}

export const postUserRegister = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ userExist: true, message: 'Email is already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        // Generate a JWT token after successful registration
        const token = jwt.sign(
            { adminId: newUser._id },
            process.env.JWT_SECRET_TOKEN,
            {
                expiresIn: "1h",
            }
        );

        // Save the token in the session
        req.session.userToken = token;

        res.status(201).json({ userRegistered: true, message: 'Registration successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ internalError: true, message: 'Server error' });
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
        const offers = await Offer.find().lean();
        // Format the date strings in the offers array
        offers.forEach((offer) => {
            offer.expiresFrom = new Date(offer.expiresFrom).toLocaleDateString('en-GB');
            offer.expiresTo = new Date(offer.expiresTo).toLocaleDateString('en-GB');
        });
        res.render('offers', { offerPage: true, offers })
    } catch (error) {
        res.status(500).send(error)
    }
}

export const getSingleOfferPage = async (req, res) => {
    try {
        const { offerId } = req.params
        const offer = await Offer.findOne({ _id: offerId }).lean()
        if (!offer) {
            return res.status(404).send({ message: 'No such offer found' })
        }
        res.render('offer-details', { offer })  
    } catch (error) {
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

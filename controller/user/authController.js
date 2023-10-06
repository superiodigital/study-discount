import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from "../../models/schema/userSchema.js";


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
                        expiresIn: "30d",
                    }
                );

                // Store the token in the session cookie
                req.session.userToken = token;

                // Save the token in a regular cookie
                res.cookie("token", token, {
                    httpOnly: true, // The cookie cannot be accessed by JavaScript
                    secure: process.env.NODE_ENV === "production", // Use secure cookies in production (HTTPS)
                    maxAge: 2592000000, // Session expiration time (1 month)
                });
                res.status(200).json({
                    success: true,
                    message: "user logged",
                    route: req.session.previousRoute ? req.session.previousRoute : '/'
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
                expiresIn: "30d",
            }
        );

        // Save the token in the session
        req.session.userToken = token;

        res.status(201).json({
            userRegistered: true,
            message: 'Registration successful',
            route: req.session.previousRoute ? req.session.previousRoute : '/'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ internalError: true, message: 'Server error' });
    }
}

export const signUpWhileRegister = async (userSession, userData) => {
    try {
        if (userSession) {
            return { userExist: true }
        }
        const { name: username, email, phone } = userData;
        try {
            // Check if the email is already registered
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return { userExist: true }
            }

            // Create a new user
            const newUser = new User({
                username,
                email,
                phone
            });

            await newUser.save();

            // Generate a JWT token after successful registration
            const token = jwt.sign(
                { adminId: newUser._id },
                process.env.JWT_SECRET_TOKEN,
                {
                    expiresIn: "30d",
                }
            );

            // Save the token in the session
            return { userRegistered: true, token }
        } catch (error) {
            return { error }
        }
    } catch (error) {
        console.log(error);
        return { error }
    }
}

export const getLogoutUser = async (req, res) => {
    try {
        req.session.userToken = undefined;
        const previousRoute = req.get('Referer') || '/';
        const fullUrl = previousRoute;
        const url = new URL(fullUrl);
        const path = `${url.pathname}${url.search}${url.hash}`;
        res.redirect(path ? path : '/')
    } catch (error) {
        return { error }
    }
}
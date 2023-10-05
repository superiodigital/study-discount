import Admin from '../../models/schema/adminSchema.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../../models/schema/userSchema.js'

export const getAdminHome = async (req, res) => {
    try {
        const users = await (await User.find({}).lean().sort()).reverse()
        res.render('admin/index', { layout: 'admin-layout', users })
    } catch (error) {
        res.status(500).send(error)
    }
}
export const getAdminLogin = async (req, res) => {
    try {
        res.render('admin/admin-login', { layout: 'admin-layout', isLogin: true })
    } catch (error) {
        res.status(500).send(error)
    }
}
export const getCompanyUpdatesPage = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).send(error)
    }
}
export const postAdminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email: email });
        if (admin) {
            const isPasswordValid = await bcrypt.compare(password, admin.password);
            if (isPasswordValid) {
                const token = jwt.sign(
                    { adminId: admin._id },
                    process.env.JWT_SECRET_TOKEN,
                    {
                        expiresIn: "1h",
                    }
                );
0
                // Store the token in the session cookie
                req.session.adminToken = token;

                // Save the token in a regular cookie
                res.cookie("token", token, {
                    httpOnly: true, // The cookie cannot be accessed by JavaScript
                    secure: process.env.NODE_ENV === "production", // Use secure cookies in production (HTTPS)
                    maxAge: 3600000, // Session expiration time (1 hour)
                });
                res.status(200).json({
                    success: true,
                    message: "admin logged",
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

export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.deleteOne({ _id: req.params.userId })
        res.redirect('/admin')
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
import Contact from "../../models/schema/contactSchema.js";

export const postContactSubmit = async (req, res) => {
    try {
        const data = req.body
        const newContact = new Contact(data);
        await newContact.save();
        res.status(200).json({ status: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
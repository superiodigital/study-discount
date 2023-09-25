import FAQ from "../../models/schema/faqSchema.js";

export const getFaqManager = async (req, res) => {
    try {
        const faqs = await FAQ.find({}).lean()
        res.render('admin/faq-manager', { layout: 'admin-layout', faqs })
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}

export const getAddFaqManager = async (req, res) => {
    try {
        res.render('admin/add-faq', { layout: 'admin-layout' })
    } catch (error) {
        res.status(500).send(error)
    }
}

export const postAddFaqManager = async (req, res) => {
    try {
        const { question, answer, category } = req.body
        const faq = new FAQ({
            question: question,
            answer: answer,
            category: category
        })
        await faq.save()
        res.redirect('/admin/faq-manager')
    } catch (error) {
        res.status(500).send(error)
    }
}

export const deleteFaqManager = async (req, res) => {
    try {
        const { faqId } = req.params
        const faqManager = await FAQ.deleteOne({ _id: faqId })
        res.status(200).json({ status: true, message: 'faq deleted successfully' });
    } catch (error) {
        res.status(500).send(error)
    }
}

export const getEditFaqManager = async (req, res) => {
    try {
        const { faqId } = req.params
        const faq = await FAQ.findById(faqId).lean();
        res.render('admin/edit-faq', { layout: 'admin-layout', faq })
    } catch (error) {
        res.status(500).send(error)
    }
}

export const postEditFaqManager = async (req, res) => {
    try {
        const { faqId } = req.params
        const faq = await FAQ.findById(faqId)
        faq.question = req.body.question
        faq.answer = req.body.answer
        if (req.body.category !== '') {
            faq.category = req.body.category
        }
        await faq.save()
        res.redirect('/admin/faq-manager')
    } catch (error) {
        res.status(500).send(error)
    }
}
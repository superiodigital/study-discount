import TermsAndConditions from "../../models/schema/termsAndConditions.js";
export const getTermsAndConditionsManager = async (req, res) => {
    try {
        const termsAndConditions = await TermsAndConditions.find({}).lean()
        res.render('admin/terms-conditions-manager', { layout: 'admin-layout', termsAndConditions })
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}

export const getAddTermsAndConditionsManager = async (req, res) => {
    try {
        res.render('admin/add-terms-conditions', { layout: 'admin-layout' })
    } catch (error) {
        res.status(500).send(error)
    }
}

export const postAddTermsAndConditionsManager = async (req, res) => {
    try {
        const { heading, description } = req.body
        const termsAndCondition = new TermsAndConditions({
            heading: heading,
            description: description,
        })
        await termsAndCondition.save()
        res.redirect('/admin/terms-and-condition')
    } catch (error) {
        res.status(500).send(error)
    }
}

export const deleteTermsAndConditionsManager = async (req, res) => {
    try {
        const { termsAndConditionsId } = req.params
        const termsAndConditionManager = await TermsAndConditions.deleteOne({ _id: termsAndConditionsId })
        res.status(200).json({ status: true, message: 'termsAndCondition deleted successfully' });
    } catch (error) {
        res.status(500).send(error)
    }
}

export const getEditTermsAndConditionsManager = async (req, res) => {
    try {
        const { termsAndConditionsId } = req.params
        const termsAndCondition = await TermsAndConditions.findById(termsAndConditionsId).lean();
        res.render('admin/edit-terms-conditions', { layout: 'admin-layout', termsAndCondition })
    } catch (error) {
        res.status(500).send(error)
    }
}

export const postEditTermsAndConditionsManager = async (req, res) => {
    try {
        const { termsAndConditionsId } = req.params
        const termsAndCondition = await TermsAndConditions.findById(termsAndConditionsId)
        termsAndCondition.heading = req.body.heading
        termsAndCondition.description = req.body.description
        await termsAndCondition.save()
        res.redirect('/admin/terms-and-condition')
    } catch (error) {
        res.status(500).send(error)
    }
}
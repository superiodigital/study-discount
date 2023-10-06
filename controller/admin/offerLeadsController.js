import pkg from 'exceljs';
const { Workbook, Worksheet } = pkg;
import OfferLead from '../../models/schema/offerLeads.js';

export const getDownloadLeads = async (req, res) => {
    try {
        const leads = await OfferLead.find({ isBlocked: true }).populate('offerId')
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('OfferLead Data');
        leads.forEach((lead) => {
            if (lead?.gifts?.length > 0) {
                lead.gifts = lead.gifts[0]
            } else {
                lead.gifts = null
            }
        })

        // Define column headers
        worksheet.columns = [
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Phone', key: 'phone', width: 15 },
            { header: 'Offer', key: 'offer', width: 30 },
            { header: 'Gift', key: 'Gift', width: 30 },
        ];

        // Iterate over Mongoose documents and add them to the worksheet
        leads.forEach((lead) => {
            worksheet.addRow({ name: lead.name, email: lead.email, phone: lead.phone, offer: lead.offerId?.name , Gift: lead?.gifts?lead?.gifts.name : 'No Gifts' });
        });

        // Generate a unique filename in "dd-mm-yyyy" format
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const filename = `OfferLeadData_${day}-${month}-${year}.xlsx`;
        // Set content type and headers for the download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        // Send the Excel sheet to the client
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.log(error);
    }
}

export const getOfferLeadTable = async (req, res) => {
    try {
        const offerLeads = await OfferLead.find({ isBlocked: true }).populate('offerId gifts').lean()
        offerLeads.forEach((lead) => {
            if (lead?.gifts?.length > 0) {
                lead.gifts = lead.gifts[0]
            } else {
                lead.gifts = null
            }
        })
        res.render('admin/offerLead-manager.hbs', { layout: 'admin-layout', offerLeads })
    } catch (error) {
        console.log(error);
    }
}

export const putOfferLeadDisable = async (req, res) => {
    try {
        const { leadId } = req.params
        const offerLead = await OfferLead.findById(leadId)
        offerLead.isBlocked = false
        await offerLead.save()
        res.status(200).json({ status: true, message: 'Moved to bin successfully' });
    } catch (error) {
        console.log(error);
    }
}

export const putOfferLeadEnable = async (req, res) => {
    try {
        const { leadId } = req.params
        const offerLead = await OfferLead.findById(leadId)
        offerLead.isBlocked = true
        await offerLead.save()
        res.status(200).json({ status: true, message: 'Moved to Lead list' });
    } catch (error) {
        console.log(error);
    }
}

export const getLeadsLogs = async (req, res) => {
    try {
        const offerLeads = await OfferLead.find({ isBlocked: false }).populate('offerId').lean()
        res.render('admin/leads-bin', { layout: 'admin-layout', offerLeads })
    } catch (error) {
        console.log(error);
    }
}

export const deleteLeadsLogs = async (req, res) => {
    try {
        const { leadId } = req.params
        const offerLeads = await OfferLead.deleteOne({ isBlocked: false, _id: leadId })
        res.status(200).json({ status: true, message: 'deleted' });
    } catch (error) {
        console.log(error);
    }
}
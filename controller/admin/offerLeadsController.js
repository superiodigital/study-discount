import pkg from 'exceljs';
const { Workbook, Worksheet } = pkg;
import OfferLead from '../../models/schema/offerLeads.js';

export const getDownloadLeads = async (req, res) => {
    try {
        const leads = await OfferLead.find().populate('offerId')
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('OfferLead Data');

        // Define column headers
        worksheet.columns = [
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Phone', key: 'phone', width: 15 },
            { header: 'Offer', key: 'offer', width: 30 },
        ];

        // Iterate over Mongoose documents and add them to the worksheet
        leads.forEach((lead) => {
            worksheet.addRow({ name: lead.name, email: lead.email, phone: lead.phone, offer: lead.offerId?.shortDescription });
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

export const getOfferLeadTable = (req, res) => {
    try {
        res.render('admin/offerLead-manager.hbs', { layout: 'admin-layout' })
    } catch (error) {
        console.log(error);

    }
}
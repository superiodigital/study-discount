import Banner from "../../models/schema/bannerSchema.js"
import fs from 'fs/promises';

export const getAddBannerPage = async (req, res) => {
    try {
        res.render('admin/add-banners', { layout: 'admin-layout' })
    } catch (error) {
        res.status(500).send(error)
    }
}

export const getBannerManger = async (req, res) => {
    try {
        const banner = await Banner.find().lean()
        res.status(200).render('admin/banners-manager', { layout: 'admin-layout', banner })
    } catch (error) {
        res.status(500).send(error)
    }
}

export const deleteBannerFun = async (req, res) => {
    try {
        const { bannerId } = req.params;
        const banner = await Banner.findById(bannerId);

        if (!banner) {
            return res.status(404).json({ status: false, error: 'Banner not found' });
        }

        // Get the filename associated with the banner
        const filename = banner.filePath;

        // Remove the banner from the database
        await Banner.findByIdAndDelete(bannerId);

        // Remove the file from the uploads folder
        await fs.unlink(`public/uploads/${filename}`);

        res.status(200).json({ status: true, message: 'Banner deleted successfully' });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ status: false, error: 'Server error' });
    }
}

export const postAddBanners = async (req, res) => {
    try {
        const { description, url } = req.body;
        const imageUrl = req.file.filename; // The uploaded image filename

        const newBanner = new Banner({ description, filePath: imageUrl, url });
        await newBanner.save();
        res.status(201).redirect('/admin/banners')
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getEditBannerForm = async (req, res) => {
    try {
        const { bannerId } = req.params
        const banner = await Banner.findById(bannerId).lean()
        banner.expiresFrom = new Date(banner.expiresFrom).toLocaleDateString('en-GB');
        banner.expiresTo = new Date(banner.expiresTo).toLocaleDateString('en-GB');
        res.render('admin/edit-banner', { layout: 'admin-layout', banner })
    } catch (error) {
        res.status(500).json({ status: false, error: 'Server error' });
    }
}

export const postEditBannerForm = async (req, res) => {
    try {
        const { bannerId } = req.params
        const { description, url } = req.body;

        const banner = await Banner.findById(bannerId)
        if (!banner) {
            res.status(404).send('not fount ')
        }
        banner.description = description
        banner.url = url
        if (req.file?.filename) {
            await fs.unlink(`public/uploads/${banner.filePath}`);
            banner.filePath = req.file.filename
        }
        banner.save()
        res.redirect('/admin/banners')
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: 'Server error' });
    }
}


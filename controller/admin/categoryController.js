import Category from "../../models/schema/categorySchema.js";
import fs from 'fs/promises';

export const getCategoryManage = async (req, res) => {
    try {
        const categories = await Category.find().lean()
        res.render('admin/category-manager', { layout: 'admin-layout', categories })
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: 'Server error' });
    }
}

export const getAddCategories = (req, res) => {
    try {
        res.render('admin/add-categories', { layout: 'admin-layout' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: 'Server error' });
    }
}

export const postAddCategories = async (req, res) => {
    try {
        // Access the new name of the uploaded offer image
        const newFileName = req.file.filename;
        const { name, description, url } = req.body;
        const newCategory = new Category({
            logo: newFileName,
            name,
            description,
            url
        })
        await newCategory.save()
        res.status(201).redirect('/admin/categories')

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: 'Server error' });
    }
}

export const deleteCategoriesFun = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ status: false, error: 'Banner not found' });
        }

        // Get the filename associated with the category
        const filename = category.logo;

        // Remove the category from the database
        await Category.findByIdAndDelete(categoryId);

        // Remove the file from the uploads folder
        await fs.unlink(`public/uploads/${filename}`);

        res.status(200).json({ status: true, message: 'Banner deleted successfully' });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ status: false, error: 'Server error' });
    }
}

export const getEditCategoryForm = async (req, res) => {
    try {
        const { categoryId } = req.params
        const category = await Category.findById(categoryId).lean()
        res.render('admin/edit-category', { layout: 'admin-layout', category })
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ status: false, error: 'Server error' });
    }
}

export const postEditCategoryForm = async (req, res) => {
    try {
        const { categoryId } = req.params
        const { description, name, url } = req.body;

        const category = await Category.findById(categoryId)
        if (!category) {
            return res.status(404).send('not fount ')
        }
        category.description = description
        category.name = name
        category.url = url
        if (req.file?.filename) {
            await fs.unlink(`public/uploads/${category.logo}`);
            category.logo = req.file.filename
        }
        await category.save()
        return res.redirect('/admin/categories')
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: 'Server error' });
    }
}
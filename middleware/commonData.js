// middleware.js
import Category from "../models/schema/categorySchema.js"; // Import your Category model

const addCommonDataToLocals = async (req, res, next) => {
  try {
    const categories = await Category.find().lean();
    // Fetch or generate the offers variable
    res.locals.commonData = {
      categories,
    };

    if (req.session.userToken) {
      res.locals.commonData.userLoggedIn = req.session.userToken;
    } else {
      res.locals.commonData.userLoggedIn = null;
    }
    
    next();
  } catch (error) {
    // Handle errors here
    next(error);
  }
};

export default addCommonDataToLocals;

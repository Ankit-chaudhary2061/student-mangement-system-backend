import { Request, Response } from "express";
import Category from "../../database/model/category-model";

class CategoryController {
  static async addCategory(req: Request, res: Response) {
    try {
      const { categoryName } = req.body;

      // Check if category name is provided
      if (!categoryName) {
        return res.status(400).json({
          success: false,
          message: "Category name is required",
        });
      }

      // Check if category already exists
      const exists = await Category.findOne({ where: { categoryName } });
      if (exists) {
        return res.status(409).json({
          success: false,
          message: "Category already exists",
        });
      }

      // Create new category
      const category = await Category.create({ categoryName });

      return res.status(201).json({
        success: true,
        message: "Category added successfully",
        data: category,
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error instanceof Error ? error.message : error,
      });
    }
  }
 static async getAllCategory(req: Request, res: Response) {
  try {
    const categories = await Category.findAll();

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Get All Categories Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
static async getSingleCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    // Ensure id is a single string
    const categoryId = Array.isArray(id) ? id[0] : id;

    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    console.error("Get Single Category Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
static async deleteCategory(req:Request, res:Response){
try {
    const{id}=req.params;
    const categoryId = Array.isArray(id) ? id[0] : id;

    const category = await Category.findByPk(categoryId)
    if(!category){
    return res.status(404).json({ message: "Category not found" });
    }
    await Category.destroy()
    return res.status(200).json({message:'category deleted successfully'})


} catch (error) {
   console.error("Get Single Category Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })  
}

}
static async updateCategory(req:Request, res:Response){
    try {
    const{id}=req.params;
    const categoryId = Array.isArray(id) ? id[0] : id; 
    const{categoryName}=req.body
    const category = await Category.findByPk(categoryId)
    if(!category){
    return res.status(404).json({ message: "Category not found" });

    }
    category.categoryName = categoryName
    await category.save()
    return res.status(200).json({
      message: "Category updated successfully",
      data: category,
    });
    } catch (error) {
      console.error("Get Single Category Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })   
    }
}


}

export default CategoryController;

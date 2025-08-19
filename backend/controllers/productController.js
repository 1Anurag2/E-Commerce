import Product from '../models/productModel.js';
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createSingleProduct = async (req, res) => {
    // const { name, image,category, description, price, stock , numOfReviews ,  } = req.body;
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getSingleProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }    
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateProduct = async (req, res) => {
    const productData = await Product.findById(req.params.id);
    if (!productData) {
        return res.status(404).json({ message: "Product not found" });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true , runValidators: true });
    if (!product) {
        return res.status(500).json({ message: "Error updating product" });
    }
    res.status(200).json(product);
}   

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default {
    getAllProducts,
    getSingleProduct,
    createSingleProduct,
    updateProduct,
    deleteProduct
}
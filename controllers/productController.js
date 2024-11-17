import Product from "../models/Product.js"

export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(201).json(product)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

export const getProducts = async (req, res) => {
    try {
        const { name, plu } = req.query
        const where = {}
        name && where.name === name
        plu && where.plu === plu
        if (Object.keys(where).length === 0) {
            return res.status(400).json({ error: 'Не предоставлено ни одного фильтра' });
        }
        const products = await Product.findAll({where})
        res.status(200).json(products)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
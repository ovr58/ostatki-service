import express from 'express'
import { getProducts, createProduct } from '../controllers/productController.js'
import { createStock, increaseStock, decreaseStock, createOrder, updateStock, getStocks } from '../controllers/stockController.js'
import { createShop, getShops } from '../controllers/shopController.js'

const router = express.Router()

router.post('/products', createProduct)
router.get('/products', getProducts)
router.post('/stocks', createStock)
router.put('/stocks/:id', updateStock)
router.post('/stocks/increase/:id', increaseStock)
router.post('/stocks/decrease/:id', decreaseStock)
router.post('/stocks/createorder/:id', createOrder)
router.get('/stocks', getStocks)

router.post('/shops', createShop);
router.get('/shops', getShops);

export default router
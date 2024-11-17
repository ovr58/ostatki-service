import { Op } from "sequelize";
import Product from "../models/Product.js";
import Stock from "../models/Stock.js"
import axios from "axios";

const sendActionToHistoryService = async (action) => {
  console.log('ACTION', action);
  try {
    await axios.post('http://localhost:3001/api/actions', action);
  } catch (error) {
    console.error('Failed to send action to history service:', error.message);
  }
};

const getProductPlu = async (productId) => {
  
  const product = await Product.findOne({ where: { product_id: productId } });  
  console.log('PRODUCT', product);
  if (!product) {
    return 'Product not found';
  }
  return product.plu;
}

export const createStock = async (req, res) => {
    try {
      const { quantityOnShelf, quantityInOrder, productId, shopId } = req.body;
      console.log('QUANTITY ON SHELF', quantityOnShelf);
      const stock = await Stock.create({
          quantityOnShelf,
          quantityInOrder,
          productId,
          shopId
      });
      await sendActionToHistoryService({
          action: 'CREATE_STOCK',
          date: new Date(),
          plu: await getProductPlu(productId),
          ...stock.dataValues,
      });
      console.log(stock);
      res.status(201).json(stock);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

export const updateStock = async (req, res) => {    
    try {
        const { id } = req.params
        const [updated] = await Stock.update(req.body, {
            where: { stock_id: id }
        })
        if (updated) {
            const updatedStock = await Stock.findOne({ where: { stock_id: id } })
            await sendActionToHistoryService({
              action: 'UPDATE_STOCK',
              date: new Date(),
              plu: await getProductPlu(updatedStock.productId),
              ...updatedStock.dataValues,
            });
            return res.status(200).json({ stock: updatedStock })
        }
        throw new Error('Stock not found')
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

export const decreaseStock = async (req, res) => {
    try {
      console.log('REQ PARAMS', req.params);
      const { id } = req.params;
      const { quantity } = req.body;
      const stock = await Stock.findOne({ where: { stock_id: id } });
      if (!stock) {
        throw new Error('Stock not found');
      }
      if (stock.quantityOnShelf < quantity) {
        throw new Error('Insufficient stock');
      }
      if (!quantity) {
        stock.quantityOnShelf -= 1;
      } else {
        stock.quantityOnShelf -= quantity;
      }      
      await stock.save();
      await sendActionToHistoryService({
        action: 'DECREASE_STOCK',
        date: new Date(),
        plu: await getProductPlu(stock.productId),
        ...stock.dataValues,
      });
      return res.status(200).json({ stock });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  export const createOrder = async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const stock = await Stock.findOne({ where: { stock_id: id } });
      if (!stock) {
        throw new Error('Остаток не найден');
      }
      if (!quantity) {
        throw new Error('Не указано количество товара');
      }
      stock.quantityInOrder += quantity;
      await stock.save();
      await sendActionToHistoryService({
        action: 'CREATE_ORDER',
        date: new Date(),
        plu: await getProductPlu(stock.productId),
        ...stock.dataValues,
      });
      return res.status(200).json({ stock });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  export const increaseStock = async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const stock = await Stock.findOne({ where: { stock_id: id } });
      if (!stock) {
        throw new Error('Остаток не найден');
      }
      if (!quantity) {
        stock.quantityOnShelf += 1;
      } else {
        stock.quantityOnShelf += quantity;
      }
      await stock.save();
      await sendActionToHistoryService({
        action: 'INCREASE_STOCK',
        date: new Date(),
        plu: await getProductPlu(stock.productId),
        ...stock.dataValues,
      });
      return res.status(200).json({ stock });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  export const getStocks = async (req, res) => {
    try {

        const { plu, shop_id, quantityOnShelfMin, quantityOnShelfMax, quantityInOrderMin, quantityInOrderMax } = req.query;
        const where = {};
        if (plu) {
            const product = await Product.findOne({ where: { plu } });
            if (product) {
                where.productId = product.product_id;
            }
        }
        if (shop_id) where.shopId = shop_id;
        if (quantityOnShelfMin) where.quantityOnShelf = { [Op.gte]: quantityOnShelfMin };
        if (quantityOnShelfMax) where.quantityOnShelf = { ...where.quantityOnShelf, [Op.lte]: quantityOnShelfMax };
        if (quantityInOrderMin) where.quantityInOrder = { [Op.gte]: quantityInOrderMin };
        if (quantityInOrderMax) where.quantityInOrder = { ...where.quantityInOrder, [Op.lte]: quantityInOrderMax };
        if (Object.keys(where).length === 0) {
            return res.status(400).json({ error: 'Не предоставлено ни одного фильтра' });
        }
        const stocks = await Stock.findAll({ where });
        res.status(200).json(stocks);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
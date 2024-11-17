import Shops from '../models/Shops.js';

export const createShop = async (req, res) => {
  try {
    const shop = await Shops.create(req.body);
    res.status(201).json(shop);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getShops = async (req, res) => {
  try {
    const shops = await Shops.findAll();
    res.status(200).json(shops);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
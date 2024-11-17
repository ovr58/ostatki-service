import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Shop = sequelize.define('Shop', {
  shop_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Shop;
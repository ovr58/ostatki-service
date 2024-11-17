import { DataTypes } from "sequelize"

import sequelize from "../config/database.js"

import Product from "./Product.js"
import Shop from "./Shops.js"

const Stock = sequelize.define('Stock', {
    stock_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    quantityOnShelf: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    quantityInOrder: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
          model: Product,
          key: 'product_id',
        },
    },
    shopId: {
        type: DataTypes.INTEGER,
        references: {
          model: Shop,
          key: 'shop_id',
        },
    },
})

Stock.belongsTo(Product, { foreignKey: 'productId' })
Stock.belongsTo(Shop, { foreignKey: 'shopId' })

export default Stock
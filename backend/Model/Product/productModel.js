import { DataTypes } from "sequelize";
import { sequelize } from "../../Database/db.js";

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    unit: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "per kg",
    },

    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "vegetables",
    },

    emoji: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "🌱",
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "products",
    timestamps: true,
  }
);

export default Product;

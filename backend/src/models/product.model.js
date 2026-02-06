import { DataTypes } from "sequelize";
import { sequelize } from "../database/db.js";

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

    season: {
      type: DataTypes.ENUM('Spring', 'Summer', 'Fall', 'Winter', 'Year-round'),
      allowNull: true,
      defaultValue: 'Year-round',
    },

    availability_start: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Format: MM-DD (e.g., 03-01 for March 1st)',
    },

    availability_end: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Format: MM-DD (e.g., 08-31 for August 31st)',
    },
  },
  {
    tableName: "products",
    timestamps: true,
  }
);

export default Product;

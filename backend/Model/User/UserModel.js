import { DataTypes } from "sequelize";
import { sequelize } from "../../Database/db.js";

const User = sequelize.define(
  "User",
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "customer",
      validate: {
        isIn: [["customer", "admin"]]
      }
    },
    // Delivery address (Kathmandu Valley)
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Email verification fields
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verification_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verification_expires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Password reset fields
    reset_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reset_expires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Account status
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

export default User;
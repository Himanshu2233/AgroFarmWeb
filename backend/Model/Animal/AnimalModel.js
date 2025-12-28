import { DataTypes } from 'sequelize';
import { sequelize } from '../../Database/db.js';

const Animal = sequelize.define('Animal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  age: {
    type: DataTypes.STRING,
    allowNull: true
  },
  weight: {
    type: DataTypes.STRING,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  emoji: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '🐄'
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'animals',
  timestamps: true
});

export default Animal;
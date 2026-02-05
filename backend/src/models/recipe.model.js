import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

const Recipe = sequelize.define('Recipe', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  ingredients: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  prep_time: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Preparation time in minutes'
  },
  cook_time: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Cooking time in minutes'
  },
  servings: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 4
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Other'
  },
  difficulty: {
    type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
    allowNull: true,
    defaultValue: 'Medium'
  }
}, {
  tableName: 'recipes',
  timestamps: true
});

export default Recipe;

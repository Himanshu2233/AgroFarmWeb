import { DataTypes } from 'sequelize';
import { sequelize } from '../../Database/db.js';

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  schedule_type: {
    type: DataTypes.STRING,  // daily, weekly, monthly, once
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  delivery_time: {
    type: DataTypes.STRING,  // morning, afternoon, evening
    allowNull: true,
    defaultValue: 'morning'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'  // pending, approved, active, completed, cancelled
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  tableName: 'bookings',
  timestamps: true
});

export default Booking;
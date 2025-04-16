const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['workout', 'goal', 'nutrition', 'system']
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  actionLink: {
    type: String
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId
  }
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;

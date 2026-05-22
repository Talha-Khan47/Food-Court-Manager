const express = require('express');
const router = express.Router();
const { getMenuItems, createMenuItem } = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminOnly');
const { deleteMenuItem, toggleAvailability } = require('../controllers/adminMenuController');

// TODO: Add auth middleware for createMenuItem once admin auth is fully hooked up
// Public get menu items
router.route('/').get(getMenuItems);

// Admin create, delete, toggle routes (protected + adminOnly)
router.route('/')
  .post(protect, adminOnly, createMenuItem)
  .delete(protect, adminOnly, deleteMenuItem)
  .patch(protect, adminOnly, toggleAvailability);


module.exports = router;

const express = require('express');
const router = express.Router();
const { getMenuItems, createMenuItem } = require('../controllers/menuController');

// TODO: Add auth middleware for createMenuItem once admin auth is fully hooked up
router.route('/').get(getMenuItems).post(createMenuItem);

module.exports = router;

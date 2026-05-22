const MenuItem = require('../models/MenuItem');

// @desc    Delete a menu item (admin only)
// @route   DELETE /api/menu/:id
// @access  Private/Admin
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MenuItem.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    return res.json({ message: 'Menu item deleted' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Toggle availability of a menu item (admin only)
// @route   PATCH /api/menu/:id/availability
// @access  Private/Admin
const toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    item.isAvailable = !item.isAvailable;
    await item.save();
    return res.json(item);
  } catch (error) {
    console.error('Error toggling availability:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { deleteMenuItem, toggleAvailability };

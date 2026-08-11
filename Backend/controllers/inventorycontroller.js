import BloodInventory from "../models/BloodInventory.js";

export const addBlood = async (req, res) => {
  try {
    const body = { ...req.body }
    if (req.user?.role === 'hospital') {
      body.hospital = req.user.id
    }

    const blood = await BloodInventory.create(body);

    res.status(201).json({
      message: "Blood added successfully",
      blood,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getInventory = async (req, res) => {
  try {
    const filter = req.user?.role === 'hospital' ? { hospital: req.user.id } : {}
    const inventory = await BloodInventory.find(filter)
      .populate("hospital");

    res.status(200).json(inventory);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const updateInventory = async (req, res) => {
  try {
    const inventoryItem = await BloodInventory.findById(req.params.id);
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    if (req.user?.role === 'hospital' && inventoryItem.hospital.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const blood = await BloodInventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "Inventory updated successfully",
      blood,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const deleteInventory = async (req, res) => {
  try {
    const inventoryItem = await BloodInventory.findById(req.params.id);
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    if (req.user?.role === 'hospital' && inventoryItem.hospital.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await BloodInventory.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Blood inventory deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
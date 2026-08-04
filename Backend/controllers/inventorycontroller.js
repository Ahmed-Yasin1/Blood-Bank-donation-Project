import BloodInventory from "../models/BloodInventory.js";

export const addBlood = async (req, res) => {
  try {
    const blood = await BloodInventory.create(req.body);

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
    const inventory = await BloodInventory.find()
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
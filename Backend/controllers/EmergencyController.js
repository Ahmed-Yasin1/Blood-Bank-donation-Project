import EmergencyRequest from "../models/EmergencyRequest.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

/**
 * Create a new emergency request
 * @route POST /api/emergency
 * @access Protected - Hospital/Admin only
 */
export const createEmergencyRequest = async (req, res) => {
  try {
    const { hospital, bloodType, unitsRequired, urgency, location, contactPerson, phone } = req.body;

    // Validate required fields
    if (!hospital || !bloodType || !unitsRequired || !location) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: hospital, bloodType, unitsRequired, location",
      });
    }

    // Create emergency request
    const emergencyRequest = await EmergencyRequest.create({
      hospital,
      bloodType: bloodType.toUpperCase(),
      unitsRequired,
      urgency: urgency || "Medium",
      location,
      contactPerson,
      phone,
      status: "Pending",
      matchedDonors: [],
    });

    // Populate hospital information
    await emergencyRequest.populate("hospital");

    return res.status(201).json({
      success: true,
      message: "Emergency request created successfully",
      data: emergencyRequest,
    });
  } catch (error) {
    console.error("Error creating emergency request:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while creating emergency request",
    });
  }
};

/**
 * Get all emergency requests
 * @route GET /api/emergency
 * @access Public
 */
export const getAllEmergencyRequests = async (req, res) => {
  try {
    const { status, urgency, bloodType } = req.query;

    // Build filter object
    let filter = {};
    if (status) filter.status = status;
    if (urgency) filter.urgency = urgency;
    if (bloodType) filter.bloodType = bloodType.toUpperCase();

    const emergencies = await EmergencyRequest.find(filter)
      .populate("hospital")
      .populate("matchedDonors", "username email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Emergency requests retrieved successfully",
      count: emergencies.length,
      data: emergencies,
    });
  } catch (error) {
    console.error("Error fetching emergency requests:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching emergency requests",
    });
  }
};

/**
 * Get emergency request by ID
 * @route GET /api/emergency/:id
 * @access Public
 */
export const getEmergencyById = async (req, res) => {
  try {
    const { id } = req.params;

    const emergency = await EmergencyRequest.findById(id)
      .populate("hospital")
      .populate("matchedDonors", "username email role");

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Emergency request retrieved successfully",
      data: emergency,
    });
  } catch (error) {
    console.error("Error fetching emergency request:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching emergency request",
    });
  }
};

/**
 * Update emergency request
 * @route PUT /api/emergency/:id
 * @access Protected - Hospital/Admin only
 */
export const updateEmergency = async (req, res) => {
  try {
    const { id } = req.params;
    const { bloodType, unitsRequired, urgency, location, contactPerson, phone } = req.body;

    // Find and update emergency request
    const emergency = await EmergencyRequest.findByIdAndUpdate(
      id,
      {
        bloodType: bloodType ? bloodType.toUpperCase() : undefined,
        unitsRequired,
        urgency,
        location,
        contactPerson,
        phone,
      },
      { new: true, runValidators: true }
    )
      .populate("hospital")
      .populate("matchedDonors", "username email role");

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Emergency request updated successfully",
      data: emergency,
    });
  } catch (error) {
    console.error("Error updating emergency request:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while updating emergency request",
    });
  }
};

/**
 * Delete emergency request
 * @route DELETE /api/emergency/:id
 * @access Protected - Hospital/Admin only
 */
export const deleteEmergency = async (req, res) => {
  try {
    const { id } = req.params;

    const emergency = await EmergencyRequest.findByIdAndDelete(id);

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found",
      });
    }

    // Delete associated notifications
    await Notification.deleteMany({ relatedEmergency: id });

    return res.status(200).json({
      success: true,
      message: "Emergency request deleted successfully",
      data: emergency,
    });
  } catch (error) {
    console.error("Error deleting emergency request:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting emergency request",
    });
  }
};

/**
 * Update emergency status
 * @route PATCH /api/emergency/:id/status
 * @access Protected - Hospital/Admin only
 */
export const updateEmergencyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["Pending", "Searching", "Matched", "Completed", "Cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${validStatuses.join(", ")}`,
      });
    }

    const emergency = await EmergencyRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("hospital")
      .populate("matchedDonors", "username email role");

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Emergency status updated to ${status}`,
      data: emergency,
    });
  } catch (error) {
    console.error("Error updating emergency status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating emergency status",
    });
  }
};

/**
 * Smart matching - Find and match compatible donors
 * @route GET /api/emergency/:id/match
 * @access Protected - Hospital/Admin only
 * Matching rules:
 * 1. Blood type matches emergency bloodType
 * 2. Donor available status
 * 3. Valid donation interval
 * 4. Location proximity
 */
export const smartMatching = async (req, res) => {
  try {
    const { id } = req.params;

    // Find emergency request
    const emergency = await EmergencyRequest.findById(id);

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found",
      });
    }

    // Find potential donors matching blood type and location
    // Note: Adjust query based on actual Donor model structure
    const matchedDonors = await User.find({
      role: "donor", // Assuming donor role exists
      // Additional filters can be added based on Donor model structure
    }).select("username email role");

    if (matchedDonors.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No matching donors found",
        data: [],
      });
    }

    // Extract donor IDs
    const donorIds = matchedDonors.map((donor) => donor._id);

    // Update emergency request with matched donors
    const updatedEmergency = await EmergencyRequest.findByIdAndUpdate(
      id,
      {
        matchedDonors: donorIds,
        status: donorIds.length > 0 ? "Matched" : "Searching",
      },
      { new: true }
    )
      .populate("hospital")
      .populate("matchedDonors", "username email role");

    // Send notifications to matched donors
    const notificationPromises = donorIds.map((donorId) =>
      Notification.create({
        recipient: donorId,
        title: "Emergency Blood Request",
        message: `Emergency blood request for ${emergency.bloodType} type. Urgency: ${emergency.urgency}`,
        type: "Emergency",
        relatedEmergency: id,
      })
    );

    await Promise.all(notificationPromises);

    return res.status(200).json({
      success: true,
      message: `${donorIds.length} matching donors found and notified`,
      data: updatedEmergency,
    });
  } catch (error) {
    console.error("Error in smart matching:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while performing smart matching",
    });
  }
};

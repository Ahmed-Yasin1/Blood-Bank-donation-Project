import EmergencyRequest from "../models/EmergencyRequest.js";
import Notification from "../models/Notification.js";
import Donor from "../models/Donor.js";
import Hospital from "../models/Hospital.js";

/**
 * Create a new emergency request
 * @route POST /api/emergency
 * @access Protected - Hospital/Admin only
 */
export const createEmergencyRequest = async (req, res) => {
  try {
    const { hospital, bloodType, unitsRequired, urgency, location, contactPerson, phone } = req.body;

    // Validate required fields
    if (!hospital || !bloodType || !unitsRequired) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: hospital, bloodType, unitsRequired",
      });
    }

    const hospitalDocument = await Hospital.findById(hospital);
    if (!hospitalDocument) {
      return res.status(404).json({
        success: false,
        message: "Selected hospital not found",
      });
    }

    const requestLocation = location || hospitalDocument.district;
    if (!requestLocation) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid district location for the emergency request",
      });
    }

    const normalizedPhone = phone ? String(phone).trim().replace(/\s|[-()\.]/g, '') : undefined

    let emergencyRequest = await EmergencyRequest.create({
      hospital,
      bloodType: bloodType.toUpperCase(),
      unitsRequired,
      urgency: urgency || "Medium",
      location: requestLocation,
      contactPerson,
      phone: normalizedPhone,
      status: "Pending",
      matchedDonors: [],
    });

    const matchedDonors = await Donor.find({
      bloodGroup: emergencyRequest.bloodType,
      district: emergencyRequest.location,
      eligibilityStatus: true,
    }).select("fullName email bloodGroup district eligibilityStatus");

    const donorIds = matchedDonors.map((donor) => donor._id);
    const updatedStatus = donorIds.length > 0 ? "Matched" : "Searching";

    if (donorIds.length > 0) {
      const notificationPromises = donorIds.map((donorId) =>
        Notification.create({
          recipient: donorId,
          title: "Emergency Blood Request",
          message: `Emergency blood request for ${emergencyRequest.bloodType}. Urgency: ${emergencyRequest.urgency}. Please respond if available.`,
          type: "Emergency",
          relatedEmergency: emergencyRequest._id,
        })
      );
      await Promise.all(notificationPromises);
    }

    emergencyRequest = await EmergencyRequest.findByIdAndUpdate(
      emergencyRequest._id,
      {
        matchedDonors: donorIds,
        status: updatedStatus,
      },
      { new: true }
    )
      .populate("hospital")
      .populate("matchedDonors", "fullName email bloodGroup district eligibilityStatus");

    return res.status(201).json({
      success: true,
      message: donorIds.length > 0
        ? `Emergency request created and ${donorIds.length} matching donors notified`
        : "Emergency request created; no eligible donors found yet",
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
      .populate("matchedDonors", "fullName email bloodGroup district eligibilityStatus")
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
      .populate("matchedDonors", "fullName email bloodGroup district eligibilityStatus");

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
      .populate("matchedDonors", "fullName email bloodGroup district eligibilityStatus");

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
      .populate("matchedDonors", "fullName email bloodGroup district eligibilityStatus");

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

    const matchedDonors = await Donor.find({
      bloodGroup: emergency.bloodType,
      district: emergency.location,
      eligibilityStatus: true,
    }).select("fullName email bloodGroup district eligibilityStatus");

    if (matchedDonors.length === 0) {
      const updatedEmergency = await EmergencyRequest.findByIdAndUpdate(
        id,
        { status: "Searching" },
        { new: true }
      ).populate("hospital");

      return res.status(200).json({
        success: true,
        message: "No matching eligible donors found for this district and blood type",
        data: updatedEmergency,
      });
    }

    const donorIds = matchedDonors.map((donor) => donor._id);

    const updatedEmergency = await EmergencyRequest.findByIdAndUpdate(
      id,
      {
        matchedDonors: donorIds,
        status: "Matched",
      },
      { new: true }
    )
      .populate("hospital")
      .populate("matchedDonors", "fullName email bloodGroup district eligibilityStatus");

    const notificationPromises = donorIds.map((donorId) =>
      Notification.create({
        recipient: donorId,
        title: "Emergency Blood Request",
        message: `Emergency blood request for ${emergency.bloodType}. Urgency: ${emergency.urgency}. Please respond if available.`,
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

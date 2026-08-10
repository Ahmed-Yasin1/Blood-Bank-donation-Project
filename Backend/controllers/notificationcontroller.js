import Notification from "../models/Notification.js";

/**
 * Send a notification to a user
 * @route POST /api/notification
 * @access Protected - Admin/System
 */
export const sendNotification = async (req, res) => {
  try {
    const { recipient, title, message, type, relatedEmergency } = req.body;

    // Validate required fields
    if (!recipient || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide recipient, title, and message",
      });
    }

    // Create notification
    const notification = await Notification.create({
      recipient,
      title,
      message,
      type: type || "System",
      relatedEmergency: relatedEmergency || null,
      isRead: false,
    });

    // Populate recipient details
    await notification.populate("recipient", "fullName email bloodGroup district eligibilityStatus");

    return res.status(201).json({
      success: true,
      message: "Notification sent successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while sending notification",
    });
  }
};

/**
 * Get all notifications for a specific user
 * @route GET /api/notification/user/:userId
 * @access Protected - User/Admin
 */
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isRead } = req.query;

    // authorization: donors can only access their own notifications
    if (req.user && req.user.role === 'donor') {
      // find donor by id and ensure it belongs to this logged-in user
      const donor = await Notification.db.model('Donor').findById(userId)
      if (!donor) {
        return res.status(404).json({ success: false, message: 'Donor not found' })
      }
      if (!donor.user || donor.user.toString() !== req.user.id.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied' })
      }
    }

    // Build filter
    let filter = { recipient: userId };
    if (isRead !== undefined) {
      filter.isRead = isRead === "true";
    }

    // Fetch notifications
    const notifications = await Notification.find(filter)
      .populate("recipient", "fullName email bloodGroup district eligibilityStatus")
      .populate("relatedEmergency", "bloodType urgency status location")
      .sort({ createdAt: -1 });

    // Count unread notifications
    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully",
      count: notifications.length,
      unreadCount,
      data: notifications,
    });
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching notifications",
    });
  }
};

/**
 * Mark a single notification as read
 * @route PATCH /api/notification/:id/read
 * @access Protected - User/Admin
 */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    // Update notification
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    )
      .populate("recipient", "fullName email bloodGroup district eligibilityStatus")
      .populate("relatedEmergency", "bloodType urgency status location");

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while marking notification as read",
    });
  }
};

/**
 * Mark all notifications as read for a user
 * @route PATCH /api/notification/read-all/:userId
 * @access Protected - User/Admin
 */
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    // Update all unread notifications
    const result = await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );

    // Fetch updated notifications
    const notifications = await Notification.find({ recipient: userId })
      .populate("recipient", "fullName email bloodGroup district eligibilityStatus")
      .populate("relatedEmergency", "bloodType urgency status location")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
      modifiedCount: result.modifiedCount,
      data: notifications,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while marking notifications as read",
    });
  }
};

/**
 * Delete a notification
 * @route DELETE /api/notification/:id
 * @access Protected - User/Admin
 */
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting notification",
    });
  }
};

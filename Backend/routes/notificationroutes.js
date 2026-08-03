import express from "express";
import {
  sendNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/NotificationController.js";

const router = express.Router();

/**
 * Notification Routes
 * Base URL: /api/notification
 */

// POST /api/notification - Send notification
// Protected: Admin/System only
// Body: { recipient, title, message, type?, relatedEmergency? }
router.post("/", sendNotification);

// GET /api/notification/user/:userId - Get all notifications for user
// Protected: User/Admin
// Query params: isRead (optional)
router.get("/user/:userId", getUserNotifications);

// PATCH /api/notification/:id/read - Mark notification as read
// Protected: User/Admin
router.patch("/:id/read", markAsRead);

// PATCH /api/notification/read-all/:userId - Mark all user notifications as read
// Protected: User/Admin
router.patch("/read-all/:userId", markAllAsRead);

// DELETE /api/notification/:id - Delete notification
// Protected: User/Admin
router.delete("/:id", deleteNotification);

export default router;

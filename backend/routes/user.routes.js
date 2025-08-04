const express = require('express');
const router = express.Router();

const { User, ActivityLog } = require('../models');
const { 
  authenticateToken,
  requireOwnership,
  requireAdmin,
  extractClientInfo,
} = require('../middleware/auth.middleware');
const { 
  validateProfileUpdate,
  validateUUID,
  validatePagination,
} = require('../middleware/validation.middleware');

/**
 * @route GET /api/users/profile
 * @desc Get current user profile
 * @access Private
 */
router.get('/profile',
  authenticateToken,
  async (req, res) => {
    try {
      const user = await User.findByPk(req.userId, {
        include: ['cases'],
      });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        });
      }
      
      res.json({
        success: true,
        data: {
          user: user.toSafeObject(),
        },
      });
    } catch (error) {
      logger.error('Get profile failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user profile',
        code: 'PROFILE_FETCH_FAILED',
      });
    }
  }
);

/**
 * @route PUT /api/users/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/profile',
  authenticateToken,
  extractClientInfo,
  validateProfileUpdate,
  async (req, res) => {
    try {
      const userId = req.userId;
      const updateData = req.body;
      
      // Remove sensitive fields that shouldn't be updated here
      delete updateData.email;
      delete updateData.password;
      delete updateData.role;
      delete updateData.status;
      
      const [updatedRowsCount] = await User.update(updateData, {
        where: { id: userId },
      });
      
      if (updatedRowsCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        });
      }
      
      // Fetch updated user
      const updatedUser = await User.findByPk(userId);
      
      // Log profile update
      await ActivityLog.logUserAction(
        userId,
        'USER_UPDATE_PROFILE',
        'User profile updated',
        {
          ipAddress: req.clientInfo.ipAddress,
          userAgent: req.clientInfo.userAgent,
          newValues: updateData,
        }
      );
      
      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: updatedUser.toSafeObject(),
        },
      });
    } catch (error) {
      logger.error('Profile update failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile',
        code: 'PROFILE_UPDATE_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/users/:userId
 * @desc Get user by ID (Admin only)
 * @access Private (Admin)
 */
router.get('/:userId',
  authenticateToken,
  requireAdmin,
  validateUUID('userId'),
  async (req, res) => {
    try {
      const { userId } = req.params;
      
      const user = await User.findByPk(userId, {
        include: ['cases'],
      });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        });
      }
      
      res.json({
        success: true,
        data: {
          user: user.toSafeObject(),
        },
      });
    } catch (error) {
      logger.error('Get user failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user',
        code: 'USER_FETCH_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/users
 * @desc Get all users (Admin only)
 * @access Private (Admin)
 */
router.get('/',
  authenticateToken,
  requireAdmin,
  validatePagination,
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;
      const sortBy = req.query.sortBy || 'created_at';
      const sortOrder = req.query.sortOrder || 'DESC';
      
      // Build where clause for filtering
      const where = {};
      if (req.query.status) {
        where.status = req.query.status;
      }
      if (req.query.role) {
        where.role = req.query.role;
      }
      if (req.query.search) {
        const { Op } = require('sequelize');
        where[Op.or] = [
          { firstName: { [Op.iLike]: `%${req.query.search}%` } },
          { lastName: { [Op.iLike]: `%${req.query.search}%` } },
          { email: { [Op.iLike]: `%${req.query.search}%` } },
        ];
      }
      
      const { count, rows: users } = await User.findAndCountAll({
        where,
        order: [[sortBy, sortOrder]],
        limit,
        offset,
        include: ['cases'],
      });
      
      const totalPages = Math.ceil(count / limit);
      
      res.json({
        success: true,
        data: {
          users: users.map(user => user.toSafeObject()),
          pagination: {
            page,
            limit,
            total: count,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
        },
      });
    } catch (error) {
      logger.error('Get users failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch users',
        code: 'USERS_FETCH_FAILED',
      });
    }
  }
);

/**
 * @route PUT /api/users/:userId/status
 * @desc Update user status (Admin only)
 * @access Private (Admin)
 */
router.put('/:userId/status',
  authenticateToken,
  requireAdmin,
  extractClientInfo,
  validateUUID('userId'),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { status } = req.body;
      
      if (!status || !['active', 'inactive', 'suspended', 'pending'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Valid status is required',
          code: 'INVALID_STATUS',
        });
      }
      
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        });
      }
      
      const oldStatus = user.status;
      await User.update({ status }, { where: { id: userId } });
      
      // Log status change
      await ActivityLog.logUserAction(
        req.userId, // Admin who made the change
        'USER_STATUS_CHANGED',
        `User ${user.email} status changed from ${oldStatus} to ${status}`,
        {
          ipAddress: req.clientInfo.ipAddress,
          userAgent: req.clientInfo.userAgent,
          oldValues: { status: oldStatus },
          newValues: { status },
          entityType: 'USER',
          entityId: userId,
        }
      );
      
      res.json({
        success: true,
        message: 'User status updated successfully',
        data: {
          userId,
          oldStatus,
          newStatus: status,
        },
      });
    } catch (error) {
      logger.error('Update user status failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update user status',
        code: 'STATUS_UPDATE_FAILED',
      });
    }
  }
);

/**
 * @route DELETE /api/users/:userId
 * @desc Delete user (Admin only - soft delete)
 * @access Private (Admin)
 */
router.delete('/:userId',
  authenticateToken,
  requireAdmin,
  extractClientInfo,
  validateUUID('userId'),
  async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (userId === req.userId) {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete your own account',
          code: 'CANNOT_DELETE_SELF',
        });
      }
      
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        });
      }
      
      // Soft delete
      await user.destroy();
      
      // Log deletion
      await ActivityLog.logUserAction(
        req.userId,
        'USER_DELETED',
        `User ${user.email} deleted`,
        {
          ipAddress: req.clientInfo.ipAddress,
          userAgent: req.clientInfo.userAgent,
          entityType: 'USER',
          entityId: userId,
          severity: 'HIGH',
        }
      );
      
      res.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      logger.error('Delete user failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete user',
        code: 'USER_DELETE_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/users/:userId/activity
 * @desc Get user activity log
 * @access Private (Own data or Admin)
 */
router.get('/:userId/activity',
  authenticateToken,
  requireOwnership('userId'),
  validateUUID('userId'),
  validatePagination,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const offset = (page - 1) * limit;
      
      const activities = await ActivityLog.findAndCountAll({
        where: { userId },
        order: [['created_at', 'DESC']],
        limit,
        offset,
      });
      
      const totalPages = Math.ceil(activities.count / limit);
      
      res.json({
        success: true,
        data: {
          activities: activities.rows,
          pagination: {
            page,
            limit,
            total: activities.count,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
        },
      });
    } catch (error) {
      logger.error('Get user activity failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user activity',
        code: 'ACTIVITY_FETCH_FAILED',
      });
    }
  }
);

/**
 * @route POST /api/users/:userId/change-password
 * @desc Change user password
 * @access Private (Own data only)
 */
router.post('/:userId/change-password',
  authenticateToken,
  requireOwnership('userId'),
  extractClientInfo,
  validateUUID('userId'),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Current password and new password are required',
          code: 'PASSWORDS_REQUIRED',
        });
      }
      
      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          error: 'New password must be at least 8 characters long',
          code: 'PASSWORD_TOO_SHORT',
        });
      }
      
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        });
      }
      
      // Verify current password
      const bcrypt = require('bcryptjs');
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        await ActivityLog.logSecurityEvent(
          userId,
          'FAILED_PASSWORD_CHANGE',
          'Failed password change attempt - invalid current password',
          req.clientInfo.ipAddress,
          req.clientInfo.userAgent,
          60
        );
        
        return res.status(400).json({
          success: false,
          error: 'Current password is incorrect',
          code: 'INVALID_CURRENT_PASSWORD',
        });
      }
      
      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      
      // Update password
      await User.update(
        { password: hashedNewPassword },
        { where: { id: userId } }
      );
      
      // Log password change
      await ActivityLog.logUserAction(
        userId,
        'USER_CHANGE_PASSWORD',
        'Password changed successfully',
        {
          ipAddress: req.clientInfo.ipAddress,
          userAgent: req.clientInfo.userAgent,
          severity: 'MEDIUM',
        }
      );
      
      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      logger.error('Change password failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to change password',
        code: 'PASSWORD_CHANGE_FAILED',
      });
    }
  }
);

module.exports = router;
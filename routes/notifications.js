const express = require('express');
const router = express.Router({ mergeParams: true });
const { isLoggedIn } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const notifications = require('../controllers/notifications');

router.get('/', isLoggedIn, catchAsync(notifications.showNotifications));

router.delete('/:notificationId', isLoggedIn, catchAsync(notifications.deleteAndView));

router.delete('/:notificationId/delete', isLoggedIn, catchAsync(notifications.delete));

module.exports = router;
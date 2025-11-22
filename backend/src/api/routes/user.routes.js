const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, checkRole } = require('../middlewares/auth.middleware');
const {
  getUsersValidation,
  updateUserValidation,
  changeUserStatusValidation
} = require('../validators/user.validator');

router.get(
  '/',
  authenticate,
  checkRole(['MASTER', 'ADMIN']),
  getUsersValidation,
  userController.getUsers
);

router.put(
  '/:id',
  authenticate,
  checkRole(['MASTER', 'ADMIN']),
  updateUserValidation,
  userController.updateUser
);

router.patch(
  '/:id/status',
  authenticate,
  checkRole(['MASTER', 'ADMIN']),
  changeUserStatusValidation,
  userController.changeUserStatus
);

module.exports = router;



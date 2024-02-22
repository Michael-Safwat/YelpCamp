const express = require('express');
const router= express.Router();
const catchAsync=require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const usersController=require('../controllers/users');

router.route('/register')
  .get(usersController.renderRegisterForm)
  .post(catchAsync(usersController.RegisterForm));

router.route('/login')
  .get(usersController.renderLogin)
  .post(storeReturnTo,passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
    usersController.loginForm);

router.get('/logout', usersController.logout); 

module.exports=router;
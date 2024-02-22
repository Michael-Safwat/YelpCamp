const express= require('express');
const router=express.Router();
const catchAsync = require('../utils/catchAsync');
const campgroundsControllers=require('../controllers/campgrounds');
const {isLoggedIn,isAuthor,validateCampground}=require('../middleware');

router.route('/')
  .get(catchAsync(campgroundsControllers.index))
  .post(isLoggedIn,validateCampground,catchAsync(campgroundsControllers.createCampground));

router.get('/add',isLoggedIn,campgroundsControllers.renderNewForm);

router.route('/:id')
  .get(catchAsync(campgroundsControllers.showCampground))
  .put(isLoggedIn,isAuthor,validateCampground,catchAsync(campgroundsControllers.updateCampground))
  .delete(isLoggedIn,isAuthor,catchAsync());


router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgroundsControllers.renderEditForm));

module.exports=router;
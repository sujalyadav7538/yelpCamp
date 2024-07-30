const express=require('express');
const router=express.Router();
const Review=require('../models/review.js');
const ExpressError = require('../utils/expressError');
const catchAsync=require('../utils/catchAsync');
const Campground=require('../models/campground.js');
const {reviewSchema}=require('../schemas.js');


router.post('/', async (req,res,next)=>{
    const campground= await Campground.findById(req.body.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${req.body.id}`);
})

router.delete('/:reviewId', catchAsync(async(req,res)=>{
   const {reviewId}=req.params;
   const {id}=req.body;
   const campground=await Campground.findById(id);
   campground.reviews.filter(review=>review.toString()!==reviewId);
   await Review.findByIdAndDelete(reviewId);
   await campground.save();
   res.redirect(`/campgrounds/${id}`);
}))

module.exports=router;
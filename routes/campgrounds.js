const express =require('express');
const router=express.Router();
const Campground=require('../models/campground');
const ExpressError = require('../utils/expressError');
const catchAsync=require('../utils/catchAsync');
const Review=require('../models/review');
const {campgroundSchema}=require('../schemas.js');




router.get('/', async (req,res)=>{
    const campgrounds= await Campground.find({});
    res.render('campground/index',{campgrounds});
    
})

router.get('/new', (req,res)=>{
  res.render('campground/new');
})

router.post('', catchAsync(async(req,res,next)=>{
  if(!req.body.campground) throw new ExpressError();
  const campground=  new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
  req.send('done');
 
}))

router.get('/:id', async (req,res)=>{
  const campground= await Campground.findById(req.params.id).populate('reviews');
  res.render('campground/show',{campground});
})


router.get('/:id/edit', async (req,res)=>{
  const campground= await Campground.findById(req.params.id);
  res.render('campground/edit',{campground});
})   

router.put('/:id', async (req,res)=>{
  const {id}=req.params;
  const campground= await Campground.findByIdAndUpdate( id, req.body.campgrounds,{runValidators:true});
 res.redirect(`/campgrounds/${campground._id}`);
})

router.delete('/:id', async (req,res)=>{
  const {id}=req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
})


module.exports=router;
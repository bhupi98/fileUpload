const express=require('express');
const app=express();
const multer=require('multer');
const path=require('path');
const AppError = require('./appError');
const appError=require('./appError');
 // storage engine
 const storage=multer.diskStorage({
     destination:'./upload/images',
     filename:(req,file,cb)=>{
         return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
     }
 })
const upload=multer({
    storage:storage,
    limits:{
        fileSize:1000000
    }
})
app.use('/profile',express.static('upload/images'));
app.post("/upload",upload.single('profile'),(req,res)=>{
    console.log(req.file)
    res.json({success:true,
    profile_url:`http://localhost:4000/profile/${req.file.filename}`})
})
function errHandler(err,req,res,next){
    if(err instanceof  multer.MulterError){
        res.json({
            success:false,
            message:err.message
        })
    }
}
app.use(errHandler)
app.all("*",(req,res,next)=>{
    throw new AppError(`Requested URL ${req.path} not found`,404);
});
app.use((err,req,res,next)=>{
    const statusCode=err.statusCode|| 500;
    res.status(statusCode).json({
        message:0,
        message:err.message,
        stack:err.stack
    })
})
app.listen(4000,console.log('server up and running '))
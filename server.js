import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import resumeModel from './models/userSchema.js';

dotenv.config(); 

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB successfully");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB", err);
    });

app.listen(4000, () => console.log("Server is running on port 4000"));



app.post('/api/create-resume', async(req,res)=>{
    try{
         console.log(req.body)
          const {resumeId,resumeName,email,username}=req.body;
          if(!resumeId || !resumeName || !email || !username)
            return res.status(400).json({error:'all fields are required'})
          const newResume=new resumeModel({
            resumeName,
            resumeId,
            email,
            username
          })
             await newResume.save();
             res.status(200).json({newResume});

    }catch(err{
          res.status(500).json({error:err.message})
    }
})


app.get('/api/getResume/:param', async(req,res)=>{
    const email=req.params.param;
    
    try{
        const existResume=await resumeModel.find({email});
        console.log(existResume)
        if(!existResume)
            return res.status(400).json({error:'email not found'})
    
        res.status(200).json({existResume});

    }catch(err){
        res.status(500).json({error:err.message})

    }
})

app.get('/api/getResumeData/:resumeId', async(req,res)=>{
    const resumeId=req.params.resumeId;
    
    try{
        const existResume=await resumeModel.find({resumeId});
        if(!existResume)
            return res.status(400).json({error:'user data is not found'})
    
        res.status(200).json({existResume});

    }catch(err){
        res.status(500).json({error:err.message})

    }
})







app.post('/api/resumedetails/:resumeId',async(req,res)=>{
    try{

          const {firstName,lastName,jobTitle,userEmail,phone,summery, address, educationList,skill, experienceList,projectList}=req.body;
     
       
          const {resumeId}=req.params;
          const updateData={firstName,lastName,jobTitle,userEmail,phone,summery,address,educationList,skill, experienceList,projectList}
          console.log(updateData)
          const result=await resumeModel.findOneAndUpdate(
            {resumeId:resumeId},
            {$set:updateData}, //set is used to update only specific fields 
            {new : true}
          )
             
                res.status(200).json({result});

    }catch(err){
        res.status(500).json({error:err.message})

    }
})

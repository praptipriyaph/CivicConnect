import express from 'express';
import dotenv from 'dotenv';
import { clerkMiddleware, requireAuth } from '@clerk/express'
import { createClient } from '@supabase/supabase-js';
import cors from "cors";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

app.use(express.json());

const supabase=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_KEY)


app.use(clerkMiddleware());

// app.get("/",requireAuth(),(req,res)=>{
//     // if(!req.auth.userId){
//     //     res.send("Failure!")
//     // }
//     res.send("Success!")
// })

app.post("/api/save-user",requireAuth(),async (req, res) => {
  try {
    console.log("API HIT")
    const user = req.body;
    const exists= await supabase.from("users").select().eq("clerk_id",user.clerk_id).maybeSingle();
    if(!exists.data){
      const { data, error } = await supabase.from("users").insert([user]);
      if (error) throw error;
      console.log("USER ADDED!")
      res.status(201).json(data);
    }
    else{
      res.status(200).send("User already exists!");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save user" });
  }
});

app.post("/api/raise-issue",requireAuth(),async (req,res)=>{
  try{
    const clerk_id=req.auth.userId
    const creator=await supabase.from("users").select("id").eq("clerk_id",clerk_id).single();
    const {title,description,latitude,longitude,image} = req.body
    const {data,error} = await supabase.from("issues").insert([{
      title,description,latitude,longitude,image,created_by:creator.data.id
    }])
    if(error)throw error;
    res.status(201).json(data)
  }
  catch(error){
  res.status(500).json({ error: error.message })  
  }
})

// app.get("api/get-issues",async (req,res)=>{

// })

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})






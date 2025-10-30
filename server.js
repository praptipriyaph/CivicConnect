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

app.post("/api/raise-complaint",requireAuth(),async (req,res)=>{
  try{
    const clerk_id=req.auth.userId
    const creator=await supabase.from("users").select("id").eq("clerk_id",clerk_id).single();
    const {title,description,latitude,longitude,image,tag} = req.body
    const {data,error} = await supabase.from("complaints").insert([{
      title,description,latitude,longitude,image,created_by:creator.data.id,tag
    }])
    if(error)throw error;
    res.status(201).json(data)
  }
  catch(error){
  res.status(500).json({ error: error.message })  
  }
})

app.get("/api/get-citizen-complaints",requireAuth(),async (req,res)=>{
  try{
    const clerk_id=req.auth.userId
    const creator=await supabase.from("users").select("id").eq("clerk_id",clerk_id).single();
    const {data,error} = await supabase.from("complaints").select("*").eq("created_by",creator.data.id);
    if(error)throw error
    res.status(200).json(data)
  }
  catch(error){
    res.status(500).json({error:error.message})
  }

})

app.get("/api/get-admin-complaints",requireAuth(),async (req,res)=>{
  try{
    const {data,error} = await supabase.from("complaints").select("*").in("status",["open","in_progress","reopened"]).order("status",{ascending:false}).order("updated_at",{ascending:true})
    if(error) throw error
    res.status(200).json(data)  
  }
  catch(error){
    res.status(500).json({error:error.message})
  }
})


//for both open->assigned and reopened->assigned 
app.patch("/api/admin-update-complaint",requireAuth(),async (req,res)=>{
  try{
    const {id,assignee}=req.body;
    const {data,error}=await supabase.from("complaints").update({
      assigned_to : assignee,
      status : "assigned",
      updated_at : new Date().toISOString()
    }).eq("id",id).select("*")

    if(error) throw error
    res.status(200).json(data)
  }
  catch(error){
    res.status(500).json({error:error.message})
  }
})

app.post("/api/citizen-recheck-complaint",requireAuth(),async (req,res)=>{
  try{
    const {complaint_id,description}=req.body
    await supabase.from("complaints").update({
      status: "reopened"
  }).eq("complaint_id",complaint_id)
    
    await supabase.from("complaint_updates").insert([
      {
        description:description,
        complaint_id:complaint_id
      }
    ])
    res.status(200).json({message:"Success!"})
  }
  catch(error){
    res.status(500).json({error:error.message})
  }
})

app.post("/api/citizen-close-complaint",requireAuth(),async (req,res)=>{
  try{
    const {complaint_id,description}=req.body
    await supabase.from("complaints").update({
      status: "closed"
  }).eq("complaint_id",complaint_id)
    
    await supabase.from("complaint_updates").insert([
      {
        description:description,
        complaint_id:complaint_id
      }
    ])
    res.status(200).json({role:"citizen",message:"Success!"})
  }
  catch(error){
    res.status(500).json({error:error.message})
  }
})


app.post("/api/admin-close-complaint",requireAuth(),async (req,res)=>{
  try{
    const {complaint_id,description}=req.body
    await supabase.from("complaints").update({
      status: "closed"
  }).eq("complaint_id",complaint_id)
    
    await supabase.from("complaint_updates").insert([
      {
        description:description,
        complaint_id:complaint_id
      }
    ])
    res.status(200).json({role:"admin",message:"Success!"})
  }
  catch(error){
    res.status(500).json({error:error.message})
  }
})


app.get("/api/get-govt-officials",requireAuth(),async (req,res)=>{
  try{
    const {data,error} = await supabase.from("users").select("*").eq("role","citizen")
    res.status(200).json(data)
  }
  catch(error){
    res.status(500).json({error:error.message})
  }
})

app.get("/api/get-govt-complaints",requireAuth(),async (req,res)=>{
  try{
    const {data,error} = await supabase.from("complaints").select("*").eq("status","assigned")
    res.status(200).json(data)
  }
  catch(error){
    res.status(500).json({error:error.message})
  }
})

app.post("/api/govt-update-complaint",requireAuth(),async (req,res)=>{
  try{

  }
  catch(error){

  }
})


app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})






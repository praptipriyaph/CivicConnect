import express from 'express';
import dotenv from 'dotenv';
import { clerkMiddleware, getAuth, requireAuth, clerkClient } from '@clerk/express';
import { createClient } from '@supabase/supabase-js';
import cors from "cors";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

app.use(express.json());

const supabase=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_KEY)


app.use(clerkMiddleware());

// app.get("/",requireAuth(),async (req,res)=>{
//     // if(!req.auth.userId){
//     //     res.send("Failure!")
//     // }
//   const {userId} = getAuth(req)
//   const {username} = await clerkClient.users.getUser(userId)

//   console.log("WPIDHAWI")
//   console.log(userId,username)

//     res.json({username})
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
      res.status(200).json({message:"User Already Exists!"});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save user" });
  }
});


app.post("/api/raise-complaint",requireAuth(),async (req,res)=>{
  try{
    const {user_id,username,title,description,latitude,longitude,image,tag} = req.body
    const {data,error} = await supabase.from("complaints").insert([{
      title,description,latitude,longitude,image,created_by:user_id,tag
    }]).select("*").single()
    
    if(error)throw error;

    const {error:update_error} = await supabase.from("complaint_updates").insert([
      {description,complaint_id:data.complaint_id,updated_by:username}
    ])

    if(update_error) throw update_error;
    
    res.status(201).json(data)
  }
  catch(error){
  res.status(500).json({ error: error.message })  
  }
})


app.get("/api/get-citizen-complaints",requireAuth(),async (req,res)=>{
  try{
    const {userId:clerk_id} = getAuth(req)
    const {data:user} = await supabase.from("users").select("user_id").eq("clerk_id",clerk_id).single();
    const {data,error} = await supabase.from("complaints").select("*").eq("created_by",user.user_id);
    if(error)throw error
    res.status(200).json(data)
  }
  catch(error){
    res.status(500).json({error:error.message})
  }

})


app.get("/api/get-admin-complaints",requireAuth(),async (req,res)=>{
  try{
    const {data,error} = await supabase.from("complaints").select("*").in("status",["open","in_progress","reopened","assigned"]).order("status",{ascending:false}).order("created_at",{ascending:true})
    if(error) throw error
    res.status(200).json(data)  
  }
  catch(error){
    res.status(500).json({error:error.message})
  }
})


//for both open->assigned and reopened->assigned , basically does recheck for admin too
app.patch("/api/admin-update-complaint",requireAuth(),async (req,res)=>{
  try{
    const {userId:clerk_id} = getAuth(req)
    const {username} = await clerkClient.users.getUser(clerk_id);
    const {assignee,complaint_id,description}=req.body;
    const {data,error}=await supabase.from("complaints").update({
      assigned_to : assignee,
      status : "assigned",
    }).eq("complaint_id",complaint_id).select("*")

    if(error) throw error

    const {error:update_error} = await supabase.from("complaint_updates").insert([{
      updated_by : username,
      complaint_id : complaint_id,
      description : description
    }
    ])

    if(update_error) throw update_error;
    res.status(200).json(data)

  }
  catch(error){
    res.status(500).json({error:error.message})
  }
})


app.patch("/api/citizen-recheck-complaint",requireAuth(),async (req,res)=>{
  try{
    const {userId:clerk_id} = getAuth(req)
    const {username} = await clerkClient.users.getUser(clerk_id);
    const {complaint_id,description}=req.body
    const {error} = await supabase.from("complaints").update({
      status: "reopened"
  }).eq("complaint_id",complaint_id)
    
  if(error) throw error;

  const {error:update_error} = await supabase.from("complaint_updates").insert([
      {
        description:description,
        complaint_id:complaint_id,
        updated_by : username
      }
    ])

    if(update_error) throw update_error;

    res.status(200).json({message:"Success!"})
  }
  catch(error){
    res.status(500).json({error:error.message})
  }
})

//used by both admin and citizen
app.post("/api/close-complaint",requireAuth(),async (req,res)=>{
  try{
    const {userId:clerk_id} = getAuth(req)
    const {username} = await clerkClient.users.getUser(clerk_id);
    const {role,complaint_id,description}=req.body
    const {error} = await supabase.from("complaints").update({
      status: "closed"
  }).eq("complaint_id",complaint_id)
    
  if(error) throw error

  const {error:update_error} =  await supabase.from("complaint_updates").insert([
      {
        description:description,
        complaint_id:complaint_id,
        updated_by : username
      }
    ])

    if(update_error) throw update_error

    res.status(200).json({role:role,message:"Success!"})
  }
  catch(error){
    res.status(500).json({error:error.message})
  }
})


app.post("/api/get-govt-officials",requireAuth(),async (req,res)=>{
  try{
    const {tag} = req.body
    const {data:department} = await supabase.from("departments").select("department_id").eq("name",tag).single()
    const {data,error} = await supabase.from("users").select("*").eq("role","official").eq("department_id",department.department_id)
    if(error) throw error
    res.status(200).json(data)
  }
  catch(error){
    res.status(500).json({error:error.message})
  }
})


app.post("/api/get-govt-complaints",requireAuth(),async (req,res)=>{
  try{
    const {assigned_to} = req.body
    const {data,error} = await supabase.from("complaints").select("*").eq("status","assigned").eq("assigned_to",assigned_to)
    if(error) throw error
    res.status(200).json(data)
  }
  catch(error){
    res.status(500).json({error:error.message})
  }
})


app.patch("/api/govt-update-complaint",requireAuth(),async (req,res)=>{
  try{
    const {userId:clerk_id} = getAuth(req)
    const {username} = await clerkClient.users.getUser(clerk_id);
    const {complaint_id,description} = req.body
    const {data,error} = await supabase.from("complaints").update({
      "status" : "in_progress",
    }).eq("complaint_id",complaint_id)

    if(error) throw error

    const {error : update_error} = await supabase.from("complaint_updates").insert([
      {
        complaint_id : complaint_id,
        description : description,
        updated_by : username
      }
    ])

    if(update_error) throw update_error

    res.status(200).json(data)

  }
  catch(error){
    res.status(500).json({error:error.message})
  }
})


app.post("/api/get-complaint-updates",requireAuth(),async (req,res)=>{
  try{
    const {complaint_id} = req.body
    const {data,error} = await supabase.from("complaint_updates").select("*").eq("complaint_id",complaint_id)

    if(error) throw error

    res.status(200).json(data)
  }
  catch(error){
    res.status(500).json({error:error.message})
  }
})


app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})






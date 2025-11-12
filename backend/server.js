import express from 'express';
import dotenv from 'dotenv';
import { clerkMiddleware, getAuth, requireAuth, clerkClient } from '@clerk/express';
import { createClient } from '@supabase/supabase-js';
import cors from "cors";
import multer from 'multer';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

app.use(express.json());

const supabase=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_KEY)

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  }
}); 

app.use(clerkMiddleware());

async function getUserFromAuth(req) {
  const {userId: clerk_id} = getAuth(req);
  const {username} = await clerkClient.users.getUser(clerk_id);
  return { clerk_id, username };
}

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
    console.log("API HIT - Save User")
    const user = req.body;
    console.log("User data received:", user);
    
    const exists = await supabase.from("users").select("*").eq("clerk_id",user.clerk_id).maybeSingle();
    
    if(!exists.data){
      const { data, error } = await supabase.from("users").insert([user]).select("*").single();
      if (error) {
        console.error("Error inserting user:", error);
        throw error;
      }
      console.log("USER ADDED! Returning isNewUser: true");
      console.log("User data:", data);
      return res.status(201).json({ 
        isNewUser: true, 
        data: data,
        message: "User created successfully" 
      });
    }
    else{
      return res.status(200).json({ isNewUser: false, message: "User Already Exists!", data: exists.data});
    }
  } catch (err) {
    console.error("Error in save-user endpoint:", err);
    res.status(500).json({ error: "Failed to save user", details: err.message });
  }
});

app.patch("/api/update-user-role", requireAuth(), async (req, res) => {
  try {
    const {userId: clerk_id} = getAuth(req);
    const {role} = req.body;
    const {data, error} = await supabase.from("users").update({ role }).eq("clerk_id", clerk_id).select().single();
    
    if (error) throw error;
    
    console.log(`Role updated to ${role} for user ${clerk_id}`);
    res.status(200).json({ message: "Role updated successfully", data });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: "Failed to update role" });
  }
});

app.post("/api/upload-image", requireAuth(), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { userId } = getAuth(req);
    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `complaints/${fileName}`;

    const { data, error } = await supabase.storage.from('complaint_images').upload(filePath, req.file.buffer, {contentType: req.file.mimetype,cacheControl: '3600',upsert: false});

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('complaint_images')
      .getPublicUrl(filePath);

    res.status(200).json({ url: publicUrl, path: filePath });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/raise-complaint",requireAuth(),async (req,res)=>{
  try{
    const {clerk_id, username} = await getUserFromAuth(req);    
    const { data: existingUser, error: existingUserError } = await supabase
      .from("users")
      .select("clerk_id")
      .eq("clerk_id", clerk_id)
      .maybeSingle();
    if (existingUserError) throw existingUserError;
    if (!existingUser) {
      const { error: insertUserError } = await supabase
        .from("users")
        .insert([{ clerk_id, username, role: "citizen" }]);
      if (insertUserError) throw insertUserError;
    }
    const {title, description, latitude, longitude, image, tag} = req.body;
    console.log(req.body)
    console.log("clerk",clerk_id)
    const {data,error} = await supabase.from("complaints").insert([{
      title,
      description,
      latitude,
      longitude,
      image,
      created_by: clerk_id, 
      tag
    }]).select("*").single()
    
    if(error)throw error;

    const {error:update_error} = await supabase.from("complaint_updates").insert([
      {description, complaint_id:data.complaint_id, updated_by:clerk_id}
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
    const {data,error} = await supabase.from("complaints").select("*").eq("created_by", clerk_id);
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


app.patch("/api/admin-update-complaint",requireAuth(),async (req,res)=>{
  try{
    const {userId:clerk_id} = getAuth(req)
    const {username} = await clerkClient.users.getUser(clerk_id);
    const {complaint_id, description} = req.body;
    const { data: complaint, error: complaintError } = await supabase
      .from("complaints")
      .select("tag")
      .eq("complaint_id", complaint_id)
      .single();

    if (complaintError) throw complaintError;
    if (!complaint || !complaint.tag) {
      throw new Error("Complaint not found or missing tag/category.");
    }

    const { data: department, error: deptError } = await supabase
      .from("departments")
      .select("department_id")
      .ilike("name", complaint.tag)
      .single();

    if (deptError) throw deptError;
    if (!department) {
      throw new Error(`Department not found for category: ${complaint.tag}`);
    }

    const {data,error} = await supabase.from("complaints").update({
      assigned_to: department.department_id, 
      status: "assigned",
    }).eq("complaint_id",complaint_id).select("*")

    if(error) throw error

    const {error:update_error} = await supabase.from("complaint_updates").insert([{
      updated_by: clerk_id, 
      complaint_id: complaint_id,
      description: description
    }])

    if(update_error) throw update_error;
    res.status(200).json(data)

  }
  catch(error){
    res.status(500).json({error:error.message})
  }
})

app.patch("/api/citizen-recheck-complaint", requireAuth(), async (req, res) => {
  try {
    const { userId: clerk_id } = getAuth(req);
    const { complaint_id, description } = req.body;
    const { data, error } = await supabase
      .from("complaints")
      .update({ status: "open" })
      .eq("complaint_id", complaint_id)
      .select("*")
      .single();

    if (error) throw error;

    const prefixedDesc = `[Lodged] ${description || "Complaint reopened by citizen for re-evaluation."}`;

    const { error: update_error } = await supabase.from("complaint_updates").insert([
      {
        complaint_id,
        description: prefixedDesc,
        updated_by: clerk_id,
      },
    ]);

    if (update_error) throw update_error;

    res.status(200).json({
      message: "Complaint successfully reopened and sent back to open stage.",
      data,
    });
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message });
  }
});

//for both citizn and admin
app.post("/api/close-complaint", requireAuth(), async (req, res) => {
  try {
    const { userId: clerk_id } = getAuth(req);
    const { complaint_id, description } = req.body;

    const { data, error } = await supabase
      .from("complaints")
      .update({ status: "closed" })
      .eq("complaint_id", complaint_id)
      .select("*")
      .single();
    if (error) throw error;

    const prefixedDesc = `[Closed] ${description}`;

    const { error: update_error } = await supabase.from("complaint_updates").insert([
      {
        complaint_id,
        description: prefixedDesc,
        updated_by: clerk_id,
      },
    ]);
    if (update_error) throw update_error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.get("/api/departments", requireAuth(), async (req, res) => {
  try {
    console.log("Fetching departments");
    const { data, error } = await supabase
      .from("departments")
      .select("department_id, name");
    
    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }
    
    console.log("Departments fetched:", data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in departments endpoint:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/resolve-complaint",requireAuth(),async (req,res)=>{
  try{
    const {complaint_id} = req.body;
    const {error} = await supabase.from("complaints").update({
      "status" : "resolved"
    }).eq("complaint_id",complaint_id);
    if(error) throw error
    res.status(200).json({flag:true})
  }
  catch(error){
    res.status(500).json({message:error.message,flag:false})
  }
})

// app.post("/api/get-govt-officials",requireAuth(),async (req,res)=>{
//   try{
//     const {tag} = req.body
//     const {data:department} = await supabase.from("departments").select("department_id").eq("name",tag).single()
    
//     if(!department) {
//       return res.status(404).json({ error: "Department not found" });
//     }
//     // Return clerk_id and user details for assignment
//     const {data,error} = await supabase.from("users")
//       .select("clerk_id, username, first_name, last_name, email")
//       .eq("role","official")
//       .eq("department_id",department.department_id)
    
//     if(error) throw error
//     res.status(200).json(data)
//   }
//   catch(error){
//     res.status(500).json({error:error.message})
//   }
// })

app.post("/api/get-govt-department",requireAuth(),async (req,res)=>{
  try{
    const {department_id} = req.body;
    const {userId:clerk_id}=getAuth(req)
    const {error} = await supabase.from("users").update({
      "department_id" : department_id,
    }).eq("clerk_id",clerk_id);
    if(error) throw error
    res.status(200).json({flag:true}) 
  }
  catch(error){
    res.status(500).json({flag:false,message:error.message});
  }
})


app.get("/api/get-govt-complaints", requireAuth(), async (req, res) => {
  try {
    const { userId: clerk_id } = getAuth(req);
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("department_id, role")
      .eq("clerk_id", clerk_id)
      .single();

      console.log(clerk_id,user)

    if (userError) throw userError;
    if (!user) return res.status(404).json({ error: "User not found" });

    const { data: department, error: deptError } = await supabase
      .from("departments")
      .select("department_id, name")
      .eq("department_id", user.department_id).single();

          console.log(department)


    if (deptError) throw deptError;

    const { data: complaints, error: complaintError } = await supabase
      .from("complaints")
      .select("*")
      .in("status", ["assigned", "in_progress"])
      .eq("assigned_to", user.department_id)
      .order("status", { ascending: true })
      .order("created_at", { ascending: false });

    if (complaintError) throw complaintError;

    console.log("AWHODAHADWOH",department)
    console.log("COMPLAINTS",complaints)

    res.status(200).json({
      department_id: user.department_id,
      department_name: department?.name || null,
      complaints: complaints || [],
    });
  } catch (error) {
    console.error("Error fetching govt complaints:", error);
    res.status(500).json({ error: error.message });
  }
});


app.get("/api/get-all-complaints", requireAuth(), async (req, res) => {
  try {
    const { data, error } = await supabase.from("complaints").select("*").order("created_at",{ ascending:false });
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching all complaints:", error);
    res.status(500).json({ error: error.message });
  }
});

// includes closed/resolved
app.get("/api/get-govt-complaints-all", requireAuth(), async (req, res) => {
  try {
    const { userId: clerk_id } = getAuth(req);

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("department_id, role")
      .eq("clerk_id", clerk_id)
      .single();

    if (userError) throw userError;
    if (!user) return res.status(404).json({ error: "User not found" });

    const { data: department, error: deptError } = await supabase
      .from("departments")
      .select("department_id, name")
      .eq("department_id", user.department_id)
      .single();

    if (deptError) throw deptError;

    const { data: complaints, error: complaintError } = await supabase
      .from("complaints")
      .select("*")
      .eq("assigned_to", user.department_id)
      .order("status", { ascending: true })
      .order("created_at", { ascending: false });

    if (complaintError) throw complaintError;

    res.status(200).json({
      department_id: user.department_id,
      department_name: department?.name || null,
      complaints: complaints || [],
    });
  } catch (error) {
    console.error("Error fetching govt complaints (all):", error);
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/govt-update-complaint", requireAuth(), async (req, res) => {
  try {
    const { userId: clerk_id } = getAuth(req);
    const { complaint_id, description, stage } = req.body;

    let newStatus = null;
    if (stage === "In Progress") newStatus = "in_progress";
    else if (stage === "Resolved") newStatus = "resolved";
    else return res.status(400).json({ error: "Invalid stage transition" });

    const { data, error } = await supabase
      .from("complaints")
      .update({ status: newStatus })
      .eq("complaint_id", complaint_id)
      .select("*")
      .single();
    if (error) throw error;

    const prefixedDesc = `[${stage}] ${description}`;

    const { error: updateError } = await supabase.from("complaint_updates").insert([
      {
        complaint_id,
        description: prefixedDesc,
        updated_by: clerk_id,
      },
    ]);
    if (updateError) throw updateError;

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


app.post("/api/get-complaint-updates", requireAuth(), async (req, res) => {
  try {
    const { complaint_id } = req.body;
    const { data: updates, error: updatesError } = await supabase
      .from("complaint_updates")
      .select("*")
      .eq("complaint_id", complaint_id)
      .order("update_time", { ascending: true });

    if (updatesError) throw updatesError;
    if (!updates || updates.length === 0)
      return res.status(200).json([]);

    const clerkIds = [...new Set(updates.map((u) => u.updated_by))];

    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("clerk_id, role, first_name, last_name, department_id")
      .in("clerk_id", clerkIds);

    if (usersError) throw usersError;

    const deptIds = [...new Set(users.map((u) => u.department_id).filter(Boolean))];
    const { data: departments } = await supabase
      .from("departments")
      .select("department_id, name")
      .in("department_id", deptIds);

    const enrichedUpdates = updates.map((u) => {
      const user = users?.find((usr) => usr.clerk_id === u.updated_by);
      const fullName = user
        ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
        : "Unknown User";

      let deptLabel = "";
      if (user?.role === "official") {
        const dept = departments?.find((d) => d.department_id === user.department_id);
        deptLabel = dept ? dept.name : "Unknown Department";
      }

      return {
        ...u,
        role: user?.role || "Unknown",
        name: fullName || "Unknown User",
        department: deptLabel || null, 
      };
    });

    res.status(200).json(enrichedUpdates);
  } catch (error) {
    console.error("Error fetching complaint updates:", error);
    res.status(500).json({ error: error.message });
  }
});


app.get("/api/get-current-user", requireAuth(), async (req, res) => {
  try {
    const { userId: clerk_id } = getAuth(req);

    const { data, error } = await supabase
      .from("users")
      .select("clerk_id, username, first_name, last_name, role, department_id")
      .eq("clerk_id", clerk_id)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "User not found in database" });
    }
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching current user:", err);
    res.status(500).json({ error: err.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})






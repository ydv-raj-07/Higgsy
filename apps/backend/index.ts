import express from "express";
import {prisma} from "./db";
import s3 from "./s3";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CreateAvatarSchema, createUserSchema } from "./types";
import { createImage } from "./image";
import { uuid } from "uuidv4";
import { file } from "bun";
import authmiddleware from "./authmiddleware";
import type { Auth } from "@google/genai/vertex_internal";

const app = express();

interface AuthenticatedRequest extends express.Request {
  userId?: string;
}

app.post("/api/v1/signup", async function (req,res){
  const {success,data} = createUserSchema.safeParse(req.body)
  if(!success){
    res.status(400).json({
      error:"username and password are required fields"
    });
    return;
  }
  const {username,password} = data;
  const existingUser = await prisma.user.findFirst({
    where:{
      username:username
    }
  })
  if(existingUser){
    res.status(400).json({
      error:"Username already exist"
    });
    return;
  }

  const hassedPassword = await bcrypt.hash(password,10);

  const newUser = await prisma.user.create({
    data:{
      username: username,
      password: hassedPassword
    },
  });
  res.json({message:"user created succesfully",id:newUser.id});
})

app.post("/api/v1/login", async function(req,res){
  const {success,data} = createUserSchema.safeParse(req.body);
  if(!success){
    res.status(400).json({
      error:"invalid username and password"
    });
    return;
  }
  const {username,password} = data;
  const existingUser = await prisma.user.findUnique({
    where:{
      username : username,
    },
  });

  if(!existingUser){
    res.status(400).json({error: "Invalid username or password"});
    return;
  }

  const passwordMatch = await bcrypt.compare(password,existingUser.password);

  if(!passwordMatch){
    res.status(400).json({
      error: "Invalid or incorrect password"
    })
    return;
  }
  const secretKey:string = process.env.JWT_SECRET as string;
  const token = jwt.sign({
    userId: existingUser.id},secretKey,
    {expiresIn :"1d",
  });
  res.json({
    message:"signIn successful",
    token: token,
  });
});

app.post("/api/v1/avatar", authmiddleware, async function(req:AuthenticatedRequest,res){
  const userId = req.userId;
  if(!userId){
    res.status(401).json({
      error: "Unauthorized"
    });
    return;
  }
  const {success,data} = CreateAvatarSchema.safeParse(req.body);
  if(!success){
    res.status(411).json({
      error: "something went wrong"
    })
    return;
  }

  const avatar = await prisma.avatar.create({
    data:{
      name:data.name,
      userId: userId
    },
  });

  const leftProfileId = uuid();
  const rightProfileId = uuid();
  const frontProfileId = uuid();

  await Promise.all([
    createImage("create a side profile for the user for the left side. It should be a high quality portfolio shoot type photo",data.image,`./assets/${leftProfileId}.png`),
    
    createImage("create a side profile for the user for the right side. It should be a high quality portfolio shoot type photo",data.image,`./assets/${rightProfileId}.png`),

    createImage("create a front profile for the user for the front side. It should be a high quality portfolio shoot type photo",data.image,`./assets/${frontProfileId}.png`)
  ])

  await Promise.all([
    s3.write(`avatars/${leftProfileId}.png`,file(`./assets/${leftProfileId}.png`)),
    s3.write(`avatars/${rightProfileId}.png`,file(`./assets/${rightProfileId}.png`)),
    s3.write(`avatars/${frontProfileId}.png`,file(`./asstes/${frontProfileId}.png`)),
  ]);

  const img = await prisma.avatarImage.createMany({
    data:[
      {
        avatarId: avatar.id,
        type: "Model",
        url: `avatars/${leftProfileId}.png`,
      },
      {
        avatarId: avatar.id,
        type: "Model",
        url: `avatars/${rightProfileId}.png`,
      },
      {
        avatarId: avatar.id,
        type: "Model",
        url: `avatars/${frontProfileId}.png`,
      }
    ]
  })

  res.json({
    message:"image generated successfuly",
    avatarId: avatar.id,
  });
});

app.post("/api/v1/video", function(req,res){
  res.send();
})

app.get("/api/v1/video/:videoId", function(req,res){
  res.send();
})

app.get("/api/v1/videos", function(req,res){
  res.send();
})

app.get("/api/v1/me", function(req,res){
  res.send();
})

app.get("/api/v1/models", function(req,res){
  res.send();
})

app.get("/api/v1/avatar/:avatarId",authmiddleware, async function(req:AuthenticatedRequest,res){
  const userId = req.userId;
  if(!userId){
    res.status(401).json({
      error: "Unauthorized"
    });
    return;
  }
  const avatarId = req.params.avatarId as string;
  
  const avatar = await prisma.avatar.findFirst({
    where:{
      id: avatarId,
      userId: userId,
    },
  });

  if(!avatar){
    res.status(404).json({
      error: "Avatar not found"
    })
    return;
  }

  const images = await prisma.avatarImage.findMany({
    where:{
      avatarId: avatarId,
    },
  });

  res.json({
    message: "Avatar fetched successfully",
    avatar: {...avatar,images},
  });
})

app.get("/api/v1/avatars",authmiddleware, async function(req:AuthenticatedRequest,res){
  

  res.send();
})

const port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log(`Server is running on port ${port}`);
})
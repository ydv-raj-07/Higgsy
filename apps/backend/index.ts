import express from "express";
import {prisma} from "./db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import z from "zod";
import { createUserSchema } from "./types";

const app = express();

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

app.post("/api/v1/avatar", function(req,res){
  res.send();
})

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

app.get("/api/v1/avatar/:avatarId", function(req,res){
  res.send();
})

app.get("/api/v1/avatars", function(req,res){
  res.send();
})

const port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log(`Server is running on port ${port}`);
})
import z from "zod";

export const createUserSchema = z.object({
  username: z.string(),
  password: z.string()
}) 

export const CreateAvatarSchema = z.object({
  name: z.string(),
  image: z.string()
})
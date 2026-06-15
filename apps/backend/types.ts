import { password } from "bun";
import z from "zod";

export const createUserSchema = z.object({
  username: z.string(),
  password: z.string()
}) 
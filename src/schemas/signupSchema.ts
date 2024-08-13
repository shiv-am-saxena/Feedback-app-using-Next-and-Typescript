import { z } from "zod";

export const usernameValidation = z
	.string()
	.min(2, "username must be at least 2 characters")
	.max(20, "username must be no more than 20 characters")
	.regex(/^[a-zA-Z0-9_]+$/, "username must not contain any special characters except underscores");


export const signupSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:"invalid email address"}),
    password: z.string().min(8, {message: "password must be at least 8 characters"})
})
import dbConnection from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { usernameValidation } from "@/schemas/signupSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
	username: usernameValidation,
});

export async function GET(req: Request) {
	await dbConnection();
	try {
		const { searchParams } = new URL(req.url);
		const queryParams = {
			username: searchParams.get("username"),
		};

		// validation with zod

		const result = UsernameQuerySchema.safeParse(queryParams);
		if (!result.success) {
			const usernameErrors = result.error.format().username?._errors || [];
			return Response.json(
				{
					success: false,
					message: usernameErrors.length > 0 ? usernameErrors.join(", ") : "Invalid Query Parameters",
				},
				{
					status: 400,
				}
			);
		}
		const { username } = result.data;
		const user = await UserModel.findOne({ username, isVerified: true });
		if (user) {
			return Response.json(
				{
					success: false,
					message: "Username already in use",
				},
				{
					status: 409,
				}
			);
		}
		return Response.json(
			{
				success: true,
				message: "Username is available",
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		console.log("Error checking username", error);
		return Response.json(
			{
				success: false,
				message: "Error checking username",
			},
			{
				status: 500,
			}
		);
	}
}

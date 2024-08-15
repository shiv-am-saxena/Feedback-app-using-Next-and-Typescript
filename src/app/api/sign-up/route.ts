import dbConnection from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import crypto from "crypto";

export async function POST(req: Request) {
    // connecting to database
	await dbConnection();
	try {
        // extracting the username email and password from request.json 
		const { username, email, password } = await req.json();

		// Check if user already exists by username
		const existingVerifiedUsername = await UserModel.findOne({ username, isVerified: true });
		if (existingVerifiedUsername) {
			return Response.json(
				{
					success: false,
					message: "Username already exists",
				},
				{
					status: 409,
				}
			);
		}
//  Generating 6 digit random number for varification code
		const randomNumber = crypto.randomInt(100000, 1000000);
		const verifyCode = String(randomNumber).padStart(6, "5");

        // Check if user already exist with the same email address
		const existingUser = await UserModel.findOne({ email });

		if (existingUser) {
            // if user already exists and email is verified then
            if(existingUser.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "Email already exists",
                    },
                    {
                        status: 409,
                    }
                );
            }
            // if user already exists but email is not verified then
            else{
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUser.password = hashedPassword;
                existingUser.verifyCode = verifyCode;
                existingUser.verifyCodeExp = new Date(Date.now() + 3600000);
                await existingUser.save();
            }
		} 
        //  if user with the email does not exist
        else {
			const hashedPassword = await bcrypt.hash(password, 10);
			const expiryDate = new Date();
			expiryDate.setHours(expiryDate.getHours() + 1);

			const newUser = new UserModel({
				username,
				email,
				password: hashedPassword,
				isVerified: false,
				verifyCode,
				verifyCodeExp: expiryDate,
				isAcceptingMsg: true,
				messages: [],
			});

			await newUser.save();
            // sending the verification code email to the user
			const emailResponse = await sendVerificationEmail(email, username, verifyCode);

			if (!emailResponse.success) {
				return Response.json(
					{
						success: false,
						message: `Failed to send verification email, ${emailResponse.message}`,
					},
					{
						status: 500,
					}
				);
			}

			return Response.json(
				{
					success: true,
					message: "User registered successfully. Please check your email for verification.",
				},
				{
					status: 201,
				}
			);
		}
	} catch (err) {
		console.error("Error registering user: " + err);
		return Response.json(
			{
				success: false,
				message: "Error registering user",
			},
			{
				status: 500,
			}
		);
	}
}

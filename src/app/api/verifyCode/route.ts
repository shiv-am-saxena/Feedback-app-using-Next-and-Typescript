import dbConnection from "@/lib/dbConnect";
import UserModel from "@/models/user.model";

export async function POST(req: Request) {
	await dbConnection();

	try {
		const { username, code } = await req.json();

		const decodedUsername = decodeURIComponent(username);
		const user = await UserModel.findOne({ username: decodedUsername });

        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                {
                    status: 500,
                }
            );
        }
        const isCodeValid = user.verifyCode === code;

        const isCodeNotExpired = new Date(user.verifyCodeExp) > new Date();

        if(isCodeNotExpired && isCodeValid){
            user.isVerified = true;
            await user.save();
            return Response.json(
                {
                    success: true,
                    message: "Email verified successfully",
                },{
                    status: 200,
                }
            );
        }
        else if(!isCodeNotExpired){
            return Response.json(
                {
                    success: false,
                    message: "Verification code expired",
                },
                {
                    status: 401,
                }
            );
        }
        else{
            return Response.json(
                {
                    success: false,
                    message: "Invalid verification code",
                },
                {
                    status: 401,
                }
            );
        }

	} catch (error) {
		console.log("Error verifying user email", error);
		return Response.json(
			{
				success: false,
				message: "Failed to verify user email",
			},
			{
				status: 500,
			}
		);
	}
}

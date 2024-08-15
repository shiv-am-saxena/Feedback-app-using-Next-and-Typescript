import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnection from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { User } from "next-auth";

export async function POST(req: Request) {
	await dbConnection();
	const session = await getServerSession(authOptions);
	const user: User = session?.user as User;
	if (!session || !session.user) {
		return Response.json(
			{
				success: false,
				message: "User not authenticated",
			},
			{
				status: 401,
			}
		);
	}
	const userId = user._id;
	const { acceptMessages } = await req.json();
	try {
		const updation = await UserModel.findByIdAndUpdate(userId, { acceptMessages }, { new: true });
		if (!updation) {
			return Response.json(
				{
					success: false,
					message: "Failed to update user status to accept messages",
				},
				{
					status: 500,
				}
			);
		}
		return Response.json(
			{
				success: true,
				message: "User status updated to accept messages",
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		console.log("Failed to update user status to accept messages", error);
		return Response.json(
			{
				success: false,
				message: "Failed to update user status to accept messages",
			},
			{
				status: 500,
			}
		);
	}
}

export async function GET(req: Request){
    await dbConnection();
	const session = await getServerSession(authOptions);
	const user: User = session?.user as User;
	if (!session || !session.user) {
		return Response.json(
			{
				success: false,
				message: "User not authenticated",
			},
			{
				status: 401,
			}
		);
	}
	const userId = user._id;
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                {
                    status: 404,
                }
            );
        }
        return Response.json(
            {
                success: true,
                message: "User fetched successfully",
                isAcceptingMessage: user.isAcceptingMsg
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.log("Failed to fetch user", error);
        return Response.json(
            {
                success: false,
                message: "Failed to fetch user",
            },
            {
                status: 500,
            }
        );
    }
}
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import dbConnection from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				email: {
					label: "Email",
					type: "email",
					placeholder: "email",
				},
				password: {
					label: "Password",
					type: "password",
					placeholder: "Password",
				},
				async authorize(credentials: any): Promise<any> {
					await dbConnection();
					try {
						const user = await UserModel.findOne({
							$or: [{ email: credentials.identifier }, { username: credentials.indentifier }],
						});
						if (!user) {
							throw new Error("User not found");
						}
						if (!user.isVerified) {
							throw new Error("Email not verified, please verify your email first");
						}
						const isMatch = await bcrypt.compare(credentials.password, user.password);
						if (!isMatch) {
							throw new Error("Invalid credentials");
						}
						if (isMatch) return user;
					} catch (err: any) {
						throw new Error(err);
					}
				},
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token._id = user._id?.toString();
				token.isVerified = user.isVerified;
				token.username = user.username;
				token.isAcceptingMessage = user.isAcceptingMessage;
			}
			return token;
		},
		async session({ session , token }) {
			if (token) {
				session.user._id = token._id;
				session.user.isVerified = token.isVerified;
				session.user.username = token.username;
				session.user.isAcceptingMessage = token.isAcceptingMessage;
			}
			return session;
		},
	},
	pages: {
		signIn: "/sign-in",
		signOut: "/sign-out",
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.AUTH_SECRET,
};

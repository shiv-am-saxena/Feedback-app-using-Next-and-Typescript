import React from "react";
import { Html, Head, Body, Container, Heading, Text } from "@react-email/components";

interface VerificationEmailProps {
    username: string;
	verificationCode: string;
}

export default function VerificationEmail({ username, verificationCode }: VerificationEmailProps) {
	return (
		<Html>
			<Head />
			<Body style={main}>
				<Container style={container}>
					<Heading style={heading}>Verify Your Email Address</Heading>
					<Text style={text}>Thank you for signing up! Please verify your email address by using the code below.</Text>
					<Text style={code}>{username} = {verificationCode}</Text>
					<Text style={text}>If you did not sign up for this account, you can ignore this email.</Text>
				</Container>
			</Body>
		</Html>
	);
};

const main: React.CSSProperties = {
	backgroundColor: "#f6f9fc",
	padding: "20px",
};

const container: React.CSSProperties = {
	backgroundColor: "#ffffff",
	borderRadius: "8px",
	boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
	padding: "40px",
	maxWidth: "600px",
	margin: "0 auto",
};

const heading: React.CSSProperties = {
	fontSize: "24px",
	marginBottom: "20px",
};

const text: React.CSSProperties = {
	fontSize: "16px",
	lineHeight: "1.5",
	marginBottom: "20px",
};

const code: React.CSSProperties = {
	fontSize: "20px",
	fontWeight: "bold",
	marginBottom: "20px",
};

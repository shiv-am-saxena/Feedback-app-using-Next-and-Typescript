import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
	content: string;
	createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
	content: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});

export interface User extends Document {
	username: string;
	email: string;
	password: string;
    isVerified: boolean;
    verifyCode: string;
    verifyCodeExp: Date;
    isAcceptingMsg: boolean;
	messages: [Message];
}
const userSchema: Schema<User> = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: [ /.+\@.+\..+/, 'please use a valid email'] },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verifyCode: { type: String },
    verifyCodeExp: { type: Date, required: true},
    isAcceptingMsg: { type: Boolean, default: false },
    messages: [messageSchema],
});

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model('User', userSchema);

export default UserModel;
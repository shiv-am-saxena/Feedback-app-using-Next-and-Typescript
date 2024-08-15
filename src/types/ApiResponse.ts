import { Message } from "@/models/user.model";
export interface ApiResponse{
    success: boolean;
    message: string;
    isAccptingMessage?: boolean;
    messages?: Array<Message>;
}
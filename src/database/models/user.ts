import mongoose, { Schema, Document } from "mongoose";
import UserInterface from "../../interfaces/UserInterface";

const UserSchema: Schema = new Schema<UserInterface>({
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    connections: [
        {
            name: { type: String },
            accountId: { type: String },
            accountDisplayName: { type: String }
        }
    ]
});

export default mongoose.model<UserInterface>('User', UserSchema);
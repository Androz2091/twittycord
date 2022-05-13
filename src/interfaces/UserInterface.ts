import UserConnectionInterface from "./UserConnectionInterface"
import { Document } from "mongoose"

export default interface UserInterface extends Document {
    userId: string,
    userEmail: string,
    connections?: UserConnectionInterface[] 
}
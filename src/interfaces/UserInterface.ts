import UserConnectionInterface from "./UserConnectionInterface"
import { Document } from "mongoose"

export default interface UserInterface extends Document {
    userId: string,
    connections?: UserConnectionInterface[] 
}
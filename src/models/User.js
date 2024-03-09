import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    journals: [{
        type:  Schema.Types.ObjectId,  //
        ref: 'Journal'
    }],
    moods: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Mood'
        }
    ]
});


const User = mongoose.model( 'User', UserSchema );
export default User;
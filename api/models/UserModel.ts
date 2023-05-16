import {Schema,model } from 'mongoose'
const UserSchema = new Schema({
    userName: {type:String,required:true,min:4},
    password: {type:String,required:true}
})

const UserModel = model('User',UserSchema);

export {UserModel}
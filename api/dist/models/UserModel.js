"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    userName: { type: String, required: true, min: 4 },
    password: { type: String, required: true }
});
const UserModel = (0, mongoose_1.model)('User', UserSchema);
exports.UserModel = UserModel;

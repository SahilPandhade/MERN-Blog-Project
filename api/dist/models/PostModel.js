"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = void 0;
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
    title: String,
    summary: String,
    content: String,
    cover: String,
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true,
});
const PostModel = (0, mongoose_1.model)('Post', PostSchema);
exports.PostModel = PostModel;

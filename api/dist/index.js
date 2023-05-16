"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const UserModel_1 = require("./models/UserModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const PostModel_1 = require("./models/PostModel");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT || 4000;
const mongoUri = process.env.MONGO_URI;
const secret = process.env.SECRET || 'SECRET';
// Now you can access your environment variables using the `process.env` object
const uploadMiddleWare = (0, multer_1.default)({
    dest: 'uploads/'
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// app.use('/uploads', express.static(__dirname.split('/api')[0]+'\\api' + '\\uploads')); //This is for mac
app.use('/uploads', express_1.default.static(__dirname.split('\\dist')[0] + "\\uploads")); //This is for Windows
const salt = bcrypt_1.default.genSaltSync(10);
mongoose_1.default.connect(mongoUri || 'mongodb://localhost:27017/test');
app.post('/register', (req, res) => {
    const { userName, password } = req.body;
    UserModel_1.UserModel.create({
        userName,
        password: bcrypt_1.default.hashSync(password, salt)
    })
        .then((userDoc) => {
        res.json({ userDoc });
    })
        .catch((err) => {
        console.log(err);
        res.status(404).json(err);
    });
});
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, password } = req.body;
    UserModel_1.UserModel.findOne({ userName }).then((userDoc) => {
        if (!userDoc) {
            // user not found
            res.status(400).json('wrong credentials');
        }
        else {
            const passOk = bcrypt_1.default.compareSync(password, userDoc.password);
            if (passOk) {
                // logged in
                jsonwebtoken_1.default.sign({ userName, id: userDoc._id }, secret, {}, (err, token) => {
                    if (err)
                        throw err;
                    if (token) {
                        res.cookie('token', token).json({
                            id: userDoc._id,
                            userName,
                        });
                    }
                });
            }
            else {
                res.status(400).json('wrong credentials');
            }
        }
    }).catch((err) => {
        console.log("Login error");
    });
}));
app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    jsonwebtoken_1.default.verify(token, secret, {}, (err, info) => {
        if (err)
            throw err;
        if (info && typeof info !== 'string' && 'id' in info) {
            res.json(info);
        }
        else {
            // handle invalid token
            res.status(401).json({ message: 'Invalid token' });
        }
    });
});
app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});
app.post('/post', uploadMiddleWare.single('file'), (req, res) => {
    if (!req.file) {
        // handle error: no file uploaded
        return res.status(400).send('No file uploaded');
    }
    const { originalname, path } = req.file;
    const paths = originalname.split('.');
    const ext = paths[paths.length - 1].toLowerCase();
    const newPath = path + "." + ext;
    console.log(newPath);
    console.log(path);
    fs_1.default.renameSync(path, newPath);
    const { token } = req.cookies;
    jsonwebtoken_1.default.verify(token, secret, {}, (err, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            throw err;
        const { title, summary, content, } = req.body;
        //type check to ensure that info is a valid decoded JWT payload before accessing its id property.
        if (info && typeof info !== 'string' && 'id' in info) {
            const postDoc = yield PostModel_1.PostModel.create({
                title: title,
                summary: summary,
                content: content,
                cover: newPath,
                author: info.id
            });
            res.json(postDoc);
        }
    }));
});
app.put('/post', uploadMiddleWare.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let newPath = null;
        if (req.file) {
            const { originalname, path } = req.file;
            const paths = originalname.split('.');
            const ext = paths[paths.length - 1];
            newPath = path + '.' + ext;
            fs_1.default.renameSync(path, newPath);
        }
        const { token } = req.cookies;
        const info = jsonwebtoken_1.default.verify(token, secret);
        if (info && typeof info !== 'string' && 'id' in info) {
            const { id, title, summary, content } = req.body;
            const postDoc = yield PostModel_1.PostModel.findById(id);
            if (!postDoc) {
                return res.status(404).send('Post not found');
            }
            const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
            if (!isAuthor) {
                return res.status(401).send('You are not the author');
            }
            postDoc.title = title;
            postDoc.summary = summary;
            postDoc.content = content;
            postDoc.cover = newPath ? newPath : postDoc.cover;
            yield postDoc.save();
            res.json(postDoc);
        }
        else {
            res.status(401).send('Unauthorized');
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}));
app.get('/post', (req, res) => {
    PostModel_1.PostModel.find()
        .populate('author', ['userName'])
        .sort({ createdAt: -1 }) //descending
        .limit(20)
        .then((posts) => {
        res.json(posts);
    });
});
app.get('/post/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const postDoc = yield PostModel_1.PostModel.findById(id).populate('author', ['userName']);
        res.json(postDoc);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to retrieve post" });
    }
}));
app.listen(4000);

import express, { response } from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { UserModel as User}  from './models/UserModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import multer from 'multer';
import fs from 'fs';
import { PostModel as Post } from './models/PostModel';
import dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT || 4000;
const mongoUri = process.env.MONGO_URI;
const secret = process.env.SECRET || 'SECRET';

const uploadMiddleWare = multer({
  dest:'uploads/'
});

const app = express();
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
// app.use('/uploads', express.static(__dirname.split('/api')[0]+'\\api' + '\\uploads')); //This is for mac
app.use('/uploads', express.static(__dirname.split('\\dist')[0]+"\\uploads")); //This is for Windows
const salt = bcrypt.genSaltSync(10);
mongoose.connect(mongoUri || 'mongodb://localhost:27017/test');

app.post('/register',  (req, res) => {
  const {userName,password} = req.body;
    User.create({
     userName,
     password:bcrypt.hashSync(password,salt)
    })
    .then((userDoc)=>{
    res.json({userDoc});
  })
  .catch((err)=>{
    console.log(err);
    res.status(404).json(err);
  })
  
});

app.post('/login', async (req,res) => {
  const {userName,password} = req.body;
  User.findOne({userName}).then((userDoc)=>{
    if(!userDoc) {
      // user not found
      res.status(400).json('wrong credentials');
    }
    else{
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        // logged in
        jwt.sign({userName,id:userDoc._id}, secret, {}, (err,token) => {
          if (err) throw err;
          if(token){
            res.cookie('token', token,{ maxAge: 3600000, httpOnly: true }).json({
              id:userDoc._id,
              userName,
            });
          }
          
        });
      } else {
        res.status(400).json('wrong credentials');
      }
    }
   
  }).catch((err)=>{
    console.log("Login error")
  })
});

app.get('/profile',(req,res)=>{

    const {token} = req.cookies;
    jwt.verify(token,secret,{},(err,info)=>{
      if(err) throw err;
      if(info && typeof info !== 'string' && 'id' in info){
        
        res.json(info);
      }
      else {
        // handle invalid token
        res.status(401).json({ message: 'Invalid token' });
      }
      
    })
});

app.post('/logout',(req,res)=>{
  res.cookie('token','').json('ok');
});

app.post('/post',uploadMiddleWare.single('file'),(req,res)=>{
  if (!req.file) {
    // handle error: no file uploaded
    return res.status(400).send('No file uploaded');
  }
  const { originalname, path } = req.file;
  const paths:string[] = originalname.split('.');
  const ext:string = paths[paths.length-1].toLowerCase();
  const newPath = path+"."+ext;
  console.log(newPath);
  console.log(path);
  fs.renameSync(path,newPath);
  const {token} = req.cookies;
  jwt.verify(token,secret,{},async (err,info)=>{
    if(err) throw err;

    const {title,summary,content,} = req.body;
    //type check to ensure that info is a valid decoded JWT payload before accessing its id property.
    if(info && typeof info !== 'string' && 'id' in info){
      const postDoc = await Post.create({
        title:title,
        summary:summary,
        content:content,
        cover:newPath,
        author:info.id
      })   
      res.json(postDoc);
    }
    
  })

  
})

app.put('/post',uploadMiddleWare.single('file'),async (req,res)=>{
  try {
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const paths = originalname.split('.');
      const ext = paths[paths.length - 1];
      newPath = path + '.' + ext;
      fs.renameSync(path, newPath);
    }
    const { token } = req.cookies;
    const info = jwt.verify(token, secret);
    if (info && typeof info !== 'string' && 'id' in info) {
      const { id, title, summary, content } = req.body;
      const postDoc = await Post.findById(id);
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
      await postDoc.save();
      res.json(postDoc);
    } else {
      res.status(401).send('Unauthorized');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
})
app.get('/post',(req,res)=>{
  Post.find()
      .populate('author',['userName'])
      .sort({createdAt:-1})     //descending
      .limit(20)
      .then((posts)=>{
    res.json(posts);
  })
})

app.get('/post/:id',async (req,res)=>{
  const {id} = req.params;
  try {
    const postDoc = await Post.findById(id).populate('author',['userName']);
    res.json(postDoc);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve post" });
  }
})

app.listen(4000);
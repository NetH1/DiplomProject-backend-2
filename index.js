import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import cors from 'cors';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import { checkAuth, handleValidationErrors } from './utils/index.js';
import { PostController, UserController } from './controllers/index.js';


mongoose.connect('mongodb+srv://admin:qwerty123@cluster0.70euhqf.mongodb.net/blog?').then(() => console.log('db ok')).catch((e) => console.log(e))


const app = express();

const storage = multer.diskStorage({
    destination: (_, __, callback) => {
        callback(null, 'uploads')
    },
    filename: (_, filename, callback) => {
        callback(null, filename.originalname)
    },
});

const avatarStorage = multer.diskStorage({
    destination: (_, __, callback) => {
        callback(null, 'avatarU')
    },
    filename: (_, filename, callback) => {
        callback(null, filename.originalname)
    },
});

const upload = multer({ storage });
const avatarUp = multer({ storage: avatarStorage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use('/avatarU', express.static('avatarU'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.authLogin);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.authRegister);
app.get('/auth/me', checkAuth, UserController.getMe);
app.patch('/update/user', checkAuth, registerValidation,  UserController.updateUser);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
});

app.post('/avatarUp', checkAuth, avatarUp.single('image'), (req, res) => {
    res.json({
        url: `/avatarU/${req.file.originalname}`
    })
});

app.get('/tags', PostController.getAllTags);
app.get('/posts/tag/:name', PostController.getAllPostsTag);


app.get('/comments/:id', PostController.getPostComments);
app.post('/comments/:id', checkAuth, PostController.createComment);

app.get('/posts', PostController.getAllPosts);
app.get('/myposts',checkAuth, PostController.getMyPosts);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.createPost);
app.get('/posts/:id', PostController.getPost);
app.delete('/posts/:id', checkAuth, PostController.removePost);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.updatePost);


app.post('/posts/:id', checkAuth, PostController.createComment);

app.listen(5000, (err) => {
    if (err) return console.log(err);

    console.log('Server OK');
});

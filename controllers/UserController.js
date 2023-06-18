import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';


export const authRegister = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });
        const user = await doc.save();
        const token = jwt.sign({
            _id: user._id,
        },
            'qwerty123',
            {
                expiresIn: '30d'
            },
        );
        const { passwordHash, ...userData } = user._doc;
        res.json({
            ...userData,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        });
    }
};


export const authLogin = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }

        const IsVallidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!IsVallidPassword) {
            return res.status(400).json({
                message: 'Неверный логин и пароль',
            });
        }
        const token = jwt.sign({
            _id: user._id,
        },
            'qwerty123',
            {
                expiresIn: '1d'
            },
        );
        const { passwordHash, ...userData } = user._doc;
        res.json({
            ...userData,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if(!user) {
            return res.status(404).json({
                message:'Пользователь не найден'
            })
        }
        const { passwordHash, ...userData } = user._doc;
        res.json(userData);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:'Нет доступа'
        })
    }
}


export const updateUser = async (req, res) => {
    try {
        const userId = req.userId; // Получаем идентификатор пользователя из аутентификации

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, // Идентификатор пользователя для обновления
            req.body, // Новые данные пользователя, переданные в теле запроса
            { new: true } // Опция, чтобы получить обновленный документ пользователя
        );

        if (updatedUser) {
            const { passwordHash, ...userData } = updatedUser._doc;
            res.json(userData);
        } else {
            res.status(404).json({
                message: 'Пользователь не найден'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось обновить данные пользователя'
        });
    }
};



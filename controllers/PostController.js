import PostModel from "../models/Post.js";


export const getAllTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();
        const tags = posts.map((item) => item.tags).flat().filter(item => item !== '').slice(0, 5);
        res.json(tags);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить посты'
        })
    }
};

export const createPost = async (req, res) => {
    try {
        const filteredTags = req.body.tags.filter(tag => tag !== "");
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: filteredTags,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        });

        const post = await doc.save();
        res.json(post)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось создать пост'
        })
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить посты'
        })
    }
};

export const getAllPostsTag = async (req, res) => {
    try {
        const tagName = req.params.name;
        const posts = await PostModel.find({ tags: tagName }).populate('user').exec();
        res.json(posts)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить посты'
        })
    }
};



export const getPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const doc = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { returnDocument: 'after' }
        ).populate('user');

        if (!doc) {
            return res.status(404).json({
                message: 'Статья не найдена'
            });
        }

        res.json(doc);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить посты'
        });
    }
};


export const getMyPosts = async (req, res) => {
    try {
        const userId = req.userId;
        const posts = await PostModel.find({ user: userId }).populate('user').exec();
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Не удалось получить посты' });
    }
};


export const removePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const doc = await PostModel.findOneAndDelete({ _id: postId });
    
        if (!doc) {
          return res.status(404).json({
            message: 'Не удалось найти пост',
          });
        }
    
        res.json({
          success: true,
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          message: 'Произошла ошибка при удалении поста',
        });
      }
};


export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        await PostModel.updateOne({
            _id: postId,
        }, {
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        });
        res.json({
            success: true,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось обновить пост'
        })
    }
};

// Comments


export const getPostComments = async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await PostModel.findById(postId).populate({
        path: 'comments',
        populate: { path: 'user' }
      }).exec();
  
      if (!post) {
        return res.status(404).json({ message: 'Пост не найден' });
      }
  
      const comments = post.comments.slice(0, 5);
      res.json(comments);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Не удалось получить комментарии' });
    }
  };


export const createComment = async (req, res) => {
    try {
      const postId = req.params.id;
      const { text } = req.body; // Предполагается, что вы передаете текст комментария и идентификатор пользователя в теле запроса
  
      const post = await PostModel.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Пост не найден' });
      }
  
      const comment = {
        user: req.userId,
        text
      };
  
      post.comments.push(comment);
      await post.save();
  
      res.json(post);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Не удалось создать комментарий' });
    }
  };
  
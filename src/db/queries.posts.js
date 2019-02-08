const Post = require("./models").Post;
const Topic = require("./models").Topic;

module.exports = {
    addPost(newPost, callback){
        return Post.create(newPost)
        .then((post) => {
            callback(null, post);
        })
        .catch((error) => {
            callback(error);
        })
    },
    getPost(id, callback){
        return Post.findById(id)
        .then((post) => {
            callback(null, post);
        })
        .catch((error) => {
            callback(error);
        })
    },
    deletePost(id, callback){
        return Post.destroy({
            where: {id}
        })
        .then((deletedRecordsCount) => {
            callback(null, deletedRecordsCount);
        })
        .catch((error) => {
            callback(error);
        })
    },
    updatePost(id, updatedPost, callback){
        return Post.findById(id)
        .then((post) => {
            if(!post){
                return callback("Post not found");
            } 

            post.update(updatedPost, {
                fields: Object.keys(updatedPost)
            })
            .then(() => {
                callback(null, post);
            })
            .catch((err) => {
                callback(err);
            });
        });
    }
}
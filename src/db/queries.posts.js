const Post = require("./models").Post;
const Topic = require("./models").Topic;
const Comment = require("./models").Comment;
const User = require("./models").User;
const Vote = require("./models").Vote;

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
        return Post.findById(id, {
            include: [
                {model: Comment, as: "comments", include: [
                    {model: User }
                ]}, {model: Vote, as: "votes"}
            ]
        })
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
    // getVotes(id, callback){
    //     return Vote.findAll({
    //         where: {
    //             userId: id
    //         }})
    //         .then((vote) => {
    //             if(vote){
    //                 callback(null, vote);
    //             } else {
    //                 callback("This user has no votes");
    //             }
    //         })
    //         .catch((err) => {
    //             callback(err);
    //         });
    // }
}
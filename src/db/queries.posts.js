const Post = require("./models").Post;
const Authorizer = require("../policies/application");

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
    deletePost(req, callback){

        return Post.findById(req.params.id)
        .then((post) => {
            const authorized = new Authorizer(req.user, post).destroy();

        if(authorized) {
            post.destroy()
            .then((res) => {
                callback(null, post);
            });
         } else {
             req.flash("notice", "You are not authorized to do that");
             callback("Forbidden");
         }
        });
    },
    updatePost(req, updatedPost, callback){
        return Post.findById(req.params.id).then((post) => {
            if(!post){
                return callback("post not found");
            }
           
        const authorized = new Authorizer(req.user, post).update();

        if(authorized){
            post.update(updatedPost, {
                fields: Object.keys(updatedPost)
            })
            .then(() => {
                callback(null, post);
            })
            .catch((err) => {
                callback(err);
            });
        } else {
            req.flash("notice", "You are not authorized to do that");
            callback("Forbidden");
        }
    });
    }
}
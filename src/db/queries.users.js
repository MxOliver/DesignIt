const User = require("./models").User;
const bcrypt = require("bcryptjs");
const Post = require("./models").Post;
const Comment = require("./models").Comment;
const Favorite = require("./models").Favorite;

module.exports = {

    createUser(newUser, callback){

        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newUser.password, salt);

        return User.create({
            email: newUser.email,
            password: hashedPassword
        })
        .then((user) => {
            callback(null, user);
        })
        .catch((err) => {
            callback(err);
        })
     },
     getUser(id, callback){

        let result = {};
        User.findById(id).then((user) => {
            if(!user){
                callback(404);
            } else {
                result["user"] = user;

                Post.scope({method: ["lastFiveFor", id]}).all()
                .then((posts) => {
                    result["posts"] = posts;

                    Comment.scope({method: ["lastFiveFor", id]}).all()
                    .then((comments) => {

                        result["comments"] = comments;

                        Favorite.scope({method: ["lastFiveFor", id]}).all().then((favorites) => {
                            result["favorites"] = favorites;


                            callback(null, result);
                        })
                        .catch((err) => {
                            console.log(err);
                            callback(err);
                        })
                    })
                    .catch((err) => {
                        callback(err);
                    })
                })
                .catch((err) => {
                    callback(err);
                })
            }
        })
     }
}
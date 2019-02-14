const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;

describe("routes : posts", () => {

    beforeEach((done) => {
        this.post;

        sequelize.sync({force: true}).then(() => {
                Topic.create({
                    title: "Winter Games",
                    description: "Post your Winter Games stories.",
                    posts: [{
                        title: "Snowball Fighting",
                        body: "So much snow!",
                        userId: this.user.id
                    }] 
                }, {
                    include: {
                        model: Post,
                        as: "posts"
                    }
                })
                .then((res) => {
                    this.post = res;
                    done();
                })
                .catch((error) => {
                    console.log(error);
                    done();
                })
            })
        });

    
        describe("Admin user performing CRUD actions for Post", () => {

            beforeEach((done) => {
                User.create({
                    email: "admin@example.com",
                    password: "123456",
                    role: "admin"
                })
                .then((user) => {
                    request.get({
                        url: "http://localhost:3000/auth/fake",
                        form: {
                            role: user.role,
                            userId: user.id,
                            email: user.email
                        }
                    }, (err, res, body) => {
                        done();
                    });
                });
            });


        });

        ///end admin context

        ///member context
        describe("Member user performing CRUD actions for Post", () => {

            beforeEach((done) => {
                request.get({
                    url: "http://localhost:3000/auth/fake",
                    form: {
                        role: "member"
                    }
                }, 
                (err, rest, body) => {
                    done();
                });
            });

            

        });
    });

    
const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;
const Comment = require("../../src/db/models").Comment;

describe("routes : comments", () => {

    beforeEach((done) => {
        this.user;
        this.topic;
        this.post;
        this.comment;

        sequelize.sync({force: true}).then((res) => {

            User.create({
                email: "starman@tesla.com",
                password: "Trekkie4lyfe"
            })
            .then((user) => {
                this.user = user;

                Topic.create({
                    title: "Expeditions to Alpha Centauri",
                    description: "A compilation of reports from recent visits to the star system.",
                    posts: [{
                        title: "My first visit to Proxima Centauri b",
                        body: "I saw some rocks.",
                        userId: this.user.id
                    }]
                }, {
                    include: {
                        model: Post,
                        as: "posts"
                    }
                })
                .then((topic) => {
                    this.topic = topic;
                    this.post = this.topic.posts[0];

                    Comment.create({
                        body: "No Way!!!!",
                        userId: this.user.id,
                        postId: this.post.id
                    })
                    .then((comment) => {
                        this.comment = comment;
                        done();
                    })
                    .catch((err) => {
                        this.comment = comment;
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });
        });
    });


    ///GUEST USER CONTEXT 
    describe("Guest attempting to perform CRUD actions for Comment", () => {

        beforeEach((done) => {
            request.get({
                url: "http://localhost:3000/auth/fake",
                form: {
                    userId: 0 ///flag to indicate mock auth to destroy any session
                }
            }, (err, res, body) => {
                done();
            });
        });

        describe("POST /topics/:topicId/posts/:postId/comments/create", () => {

            it("should not create a new comment", (done) => {
                const options = {
                    url: `${base}${this.topic.id}/posts/${this.post.id}/comments/create`,
                    form: {
                        body: "This comment is amazing!"
                    }
                };

                request.post(options,
                    (err, res, body) => {

                        Comment.findOne({where: {body: "This comment is amazing!"}})
                        .then((comment) => {
                            expect(comment).toBeNull();
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        });
                    });
            });
        });

        describe("POST /topics/:topicId/posts/:postId/comments/:id/destroy", () => {

            it("should not delete the comment with the associated ID", (done) => {
                Comment.all()
                .then((comments) => {
                    const commentCountBeforeDelete = comments.length;

                    expect(commentCountBeforeDelete).toBe(1);

                    request.post(
                        `${base}${this.topic.id}/posts/${this.post.id}/comments/#{this.comment.id}/destory`,
                        (err, res, body) => {
                            Comment.all()
                            .then((comments) => {
                                expect(err).toBeNull();
                                expect(comments.length).toBe(commentCountBeforeDelete);
                                done();
                            })
                        }
                    );
                });
            });

        });
    });
    ///END CONTEXT FOR GUEST USER

    ///SIGNED-IN USER CONTEXT
    describe("signed in user performing CRUD actions for Comment", () => {

        beforeEach((done) => {
            this.comment;

            Comment.create({
                body: "Wow Really?!",
                userId: this.user.id,
                postId: this.post.id
            })
            .then((comment) => {
                this.comment = comment;

                request.get({
                    url: "http://localhost:3000/auth/fake",
                    form: {
                        role: "member",
                        userId: this.user.id
                    }
                }, (err, res, body) => {
                    done();
                });
            });
            
        });

        describe("POST /topics/:topicId/posts/:postId/comments/create", () => {

            it("should create a new comment and redirect", (done) => {
                const options = {
                    url: `${base}${this.topic.id}/posts/${this.post.id}/comments/create`,
                    form: {
                        body: "This comment is amazing!"
                    }
                };
                request.post(options, 
                    (err, res, body) => {
                        Comment.findOne({where: {body: "This comment is amazing!"}})
                        .then((comment) => {
                            expect(comment).not.toBeNull();
                            expect(comment.body).toBe("This comment is amazing!");
                            expect(comment.id).not.toBeNull();
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        });
                    });
            });
        });

        describe("POST /topics/:topicId/posts/:postId/comments/:id/destroy", () => {

            it("should delete the comment withh the associated ID if it belongs to the user", (done) => {
    
                    request.get("http://localhost:3000/auth/fake", (err, req, body) => {
                        Comment.findOne({where: {userId: req.body.id}})
                        .then((comment) => {
                            request.post(
                                `${base}${this.topic.idd}/posts/${this.post.id}/comments/${this.comment.id}/destroy`,
                                (err, res, body) => {
                                    expect(err).toBeNull();
                                    expect(comment).toBeNull();
                                    done();
                                }
                            );
                        });  
                    });
            });

            it("should not delete comments that belong to another user", (done) => {
                User.create({
                    email: "beekeeper@example.com",
                    password: "123456789",
                    role: "member",
                    userId: 5
                })
                .then(() => {
                    Comment.findOne({where: {userId: this.user.id}})
                    .then((comment) => {
                        expect(comment.userId).toBe(this.user.id);
                        expect(comment.userId).not.toBe(5);

                        request.post(
                            `${base}${this.topic.idd}/posts/${this.post.id}/comments/${this.comment.id}/destroy`,
                            (err, res, body) => {
                                expect(err).toBeNull();
                                expect(comment).not.toBeNull();
                                done();
                            }
                        );
                    });
                });
            });
        });

    });
    ///END CONTEXT FOR SIGNED IN USER

    ///ADMIN USER CONTEXT
    describe("Admin user performing CRUD actions for Comment", () => {

        beforeEach((done) => {
            request.get({
                url: "http://localhost:3000/auth/fake",
                form: {
                    role: "Admin",
                    userId: this.user.id
                }
            }, (err, res, body) => {
                done();
            });
        });

        describe("POST /topics/:topicId/posts/:postId/comments/destroy", () => {

            it("should delete the member user's comment with the associated ID", (done) => {
                Comment.all()
                .then((comments) => {
                    const commentCountBeforeDelete = comments.length;

                    expect(commentCountBeforeDelete).toBe(1);


                    request.post(
                        `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.comment.id}/destroy`,
                        (err, res, body) => {
                            Comment.all()
                            .then((comments) => {
                                expect(err).toBeNull();
                                expect(comments.length).toBe(commentCountBeforeDelete - 1);
                                done();
                            });
                        }
                    );
                });
            });
        });
    });
});
const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Comment = require("../../src/db/models").Comment;
const User = require("../../src/db/models").User;
const Favorite = require("../../src/db/models").Favorite;

describe("Favorite", () => {

    beforeEach((done) => {
        this.user;
        this.topic;
        this.post;
        this.favorite;

        sequelize.sync({force: true}).then((res) => {

            User.create({
                email: "beekeeper@hive.com",
                password: "bees4lyfe"
            })
            .then((res) => {
                this.user = res;

                Topic.create({
                    title: "Traditions of Beekeeping",
                    description: "A compilation of first-person accounts from 21st century beekeepers.",
                    posts: [{
                        title: "Myth or Fact: Does whistling calm the bees?",
                        body: "Whistling calms you and a calm beekeeper is a safe beekeeper.",
                        userId: this.user.id
                    }]
                }, {
                    include: {
                        model: Post,
                        as: "posts"
                    }
                })
                .then((res) => {
                    this.topic = res;
                    this.post = this.topic.posts[0];

                    Comment.create({
                        body: "No Way!!",
                        userId: this.user.id,
                        postId: this.post.id
                    })
                    .then((res) => {
                        this.comment = res;
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
    });

    describe("#create()", () => {

        it("should create a favorite for a post on a user", (done) => {

            Favorite.create({
                postId: this.post.id,
                userId: this.user.id
            })
            .then((favorite) => {

                expect(favorite.postId).toBe(this.post.id);
                expect(favorite.userId).toBe(this.user.id);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a favorite without an assigned post or user", (done) => {

            Favorite.create({
                userId: null
            })
            .then((favorite) => {

                done();
            })
            .catch((err) => {
                expect(err.message).toContain("Favorite.userId cannot be null");
                expect(err.message).toContain("Favorite.postId cannot be null");
                done();
            })
        });
    });

    describe("#setUser()", () => {

        it("should associate a favorite and a user together", (done) => {

            Favorite.create({
                postId: this.post.id,
                userId: this.user.id
            })
            .then((favorite) => {
                this.favorite = favorite;
                expect(favorite.userId).toBe(this.user.id);

                User.create({
                    email: "alfie@example.com",
                    password: "password"
                })
                .then((newUser) => {

                    this.favorite.setUser(newUser)
                    .then((favorite) => {
                        expect(favorite.userId).toBe(newUser.id);
                        done();
                    })
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            })
        });
    });

    describe("#getUser()", () => {

        it("should return the associated user", (done) => {

            Favorite.create({
                userId: this.user.id,
                postId: this.post.id
            })
            .then((favorite) => {
                favorite.getUser()
                .then((user) => {
                    expect(user.id).toBe(this.user.id);
                    done();
                })
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    describe("#setPost()", () => {

        it("should associate a post and a favorite together", (done) => {

            Favorite.create({
                postId: this.post.id,
                userId: this.user.id
            })
            .then((favorite) => {
                this.favorite = favorite;

                Post.create({
                    title: "Planting a Bee-friendly Garden",
                    body: "Honeysuckle, Sunflowers, and Dahlias are just three of many bee-friendly garden flowers.",
                    topicId: this.topic.id,
                    userId: this.user.id
                })
                .then((newPost) => {
                    expect(this.favorite.postId).toBe(this.post.id);

                    this.favorite.setPost(newPost)
                    .then((favorite) => {

                        expect(favorite.postId).toBe(newPost.id);
                        done();
                    });
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            })
        });
    });

    describe("#getPost()", () => {

        it("should return the associated post", (done) => {

            Favorite.create({
                userId: this.user.id,
                postId: this.post.id
            })
            .then((favorite) => {
                this.favorite = favorite;
                this.favorite.getPost()
                .then((associatedPost) => {
                    expect(associatedPost.title).toBe("Myth or Fact: Does whistling calm the bees?");
                    done();
                });
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });
});
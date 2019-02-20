const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;
const Vote = require("../../src/db/models").Vote;

describe("routes : votes", () => {

    beforeEach((done) => {

        this.user;
        this.topic;
        this.post;
        this.vote;

        sequelize.sync({force: true}).then((res) => {

            User.create({
                email: "beekeeper@hive.com",
                password: "bees4lyfe"
            })
            .then((res) => {
                this.user = res;

                Topic.create({
                    title: "The Tradition of Beekeeping",
                    description: "A collection of first-person accounts from 21st century beekeepers.",
                    posts: [{
                        title: "Myth or Fact: Does whistling calm the bees?",
                        body: "Whistling calms you, and a calm beekeeper is a safe beekeeper.",
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
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
    });

    //GUEST USER CONTEXT
    describe("guest attempting to vote on a post", () => {

        beforeEach((done) => {
            request.get({
                url: "http://localhost:3000/auth/fake",
                form: {
                    userId: 0 ///ensure no user in scope
                }
            }, (err, res, body) => {
                done();
            });
        });

        describe("GET /topics/:topicId/posts/:postId/votes/upvote", () => {

            it("should not create a new vote", (done) => {
                const options = {
                    url: `${base}${this.topic.id}/posts/${this.post.id}/votes/upvote`
                };
                request.get(options, 
                    (err, res, body) => {
                        Vote.findOne({
                            where: {
                                userId: this.user.id,
                                postId: this.post.id
                            }
                        })
                        .then((vote) => {
                            expect(vote).toBeNull();
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

    //SIGNED IN USER CONTEXT
    describe("signed in user voting on a post", () => {

        beforeEach((done) => {
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

        describe("GET /topics/:topicId/posts/:postId/votes/upvote", () => {

            it("should create an upvote", (done) => {
                const options = {
                    url: `${base}${this.topic.id}/posts/${this.post.id}/votes/upvote`
                };
                request.get(options, 
                    (err, res, body) => {
                        Vote.findOne({
                            where: {
                                userId: this.user.id,
                                postId: this.post.id
                            }
                        })
                        .then((vote) => {
                            expect(vote).not.toBeNull();
                            expect(vote.value).toBe(1);
                            expect(vote.userId).toBe(this.user.id);
                            expect(vote.postId).toBe(this.post.id);
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        });
                    });
            });
        });

        describe("GET /topics/:topicId/posts/:postId/votes/downvote", () => {

            it("should create a downvote", (done) => {
                const options = {
                    url: `${base}${this.topic.id}/posts/${this.post.id}/votes/downvote`
                };
                request.get(options, 
                    (err, res, body) => {
                        Vote.findOne({
                            where: {
                                userId: this.user.id,
                                postId: this.post.id
                            }
                        })
                        .then((vote) => {
                            expect(vote).not.toBeNull();
                            expect(vote.value).toBe(-1);
                            expect(vote.userId).toBe(this.user.id);
                            expect(vote.postId).toBe(this.post.id);
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
});
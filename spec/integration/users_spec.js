const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const sequelize = require("../../src/db/models/index").sequelize;

const User = require("../../src/db/models").User;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Comment = require("../../src/db/models").Comment;


describe("routes : users", () => {

    beforeEach((done) => {

        sequelize.sync({force: true})
        .then(() => {
            done();
        })
        .catch((err) => {
            console.log(err);
            done();
        });
    });

    describe("GET /users/sign_up", () => {

        it("should render a view with a sign up form", (done) => {
            request.get(`${base}sign_up`, (err, res, body) => {

                expect(err).toBeNull();
                expect(body).toContain("Sign up");
                done();
            });
        });
    });

    describe("POST /users", () => {

        it("should create a new user with valid values and redirect", (done) => {

            const options = {
                url: base,
                form: {
                    email: "user@example.com",
                    password: "123456789"
                }
            }
            
            request.post(options, 
                (err, res, body) => {

                    User.findOne({where: {email: "user@example.com"}})
                    .then((user) => {
                        expect(user).not.toBeNull();
                        expect(user.email).toBe("user@example.com");
                        expect(user.id).toBe(1);
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
        });

        it("should not create a new user with invalid attributes and redirect", (done) => {

            request.post(
                {
                    url: base,
                    form: {
                        email: "no",
                        password: "123456789"
                    }
                },
                (err, res, body) => {
                    User.findOne({where: {email: "no"}})
                    .then((user) => {
                        expect(user).toBeNull();
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                }
            );
        });
    });

    describe("GET /users/sign_in", () => {

        it("should render a view with a sign in form", (done) => {
            request.get(`${base}sign_in`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Sign in");
                done();
            });
        });
    });

    describe("GET /users/:id", () => {

        beforeEach((done) => {
            this.user;
            this.post;
            this.comment;

            User.create({
                email: "beagleboy@kennel.com",
                password: "puplyfe"
            })
            .then((res) => {
                this.user = res;

                Topic.create({
                    title: "Adopt Don't Shop",
                    description: "Why you should adopt your new dog.",
                    post: [{
                        title: "Mutts: True Gems in the Rough",
                        body: "You'll never find a better pup!",
                        userId: this.user.id
                    }]
                }, {
                    include: {
                        model: Post,
                        as: "posts"
                    }
                })
                .then((res) => {
                    this.post = res.posts[0];

                    Comment.create({
                        body: "This comment is alright.",
                        postId: this.post.id,
                        userId: this.user.id
                    })
                    .then((res) => {
                        this.comment = res;
                        done();
                    })
                })
            })
        });

        it("should present a list of comments a posts a user has created", (done) => {

            request.get(`${base}${this.user.id}`, (err, res, body) => {
                expect(body).toContain("Mutts: True Gems in the Rough");
                expect(body).toContain("This comment is alright.");
                done();
            });
        });
    });
});
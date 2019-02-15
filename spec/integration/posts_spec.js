const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;

describe("routes : posts", () => {

    beforeEach((done) => {
        this.topic;
        this.post;
        this.user;
   
        sequelize.sync({force: true}).then((res) => {
   
          User.create({
            email: "member@example.com",
            password: "123456"
          })
          .then((user) => {
            this.user = user; //store the user
   
            Topic.create({
              title: "Winter Games",
              description: "Post your Winter Games stories.",
              posts: [{
                title: "Snowball Fighting",
                body: "So much snow! I wish it would snow every day.",
                userId: this.user.id
              }]
            }, {
              include: {
                model: Post,
                as: "posts"
              }
            })
            .then((topic) => {
              this.topic = topic; //store the topic
              this.post = topic.posts[0]; //store the post
              done();
            })
          })
        });
      });

    //GUEST USER CONTEXT

    describe("Guest user with member role performing CRUD operations", () => {

        beforeEach((done) => {
            this.user = null;
            done();
        })

        describe("GET /topics/:topicId/posts/:id", () => {
        
            it("should render a view with the selected post", (done) => {
                request.get(`${base}/${this.topic.id}/posts/${this.post.id}`, (error, res, body) => {
                    expect(error).toBeNull();
                    expect(body).toContain("Snowball Fighting");
                    done();
                });
            });
        });

        describe("POST /topics/:topicId/posts/create", () => {

            it("should not render a form to create a new post", (done) => {
                request.post(`${base}/${this.topic.id}/posts/create`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).not.toContain("New Post");
                    done();
                });
            });

            it("should redirect guests to sign in view", (done) => {
                request.post(`${base}/${this.topic.id}/posts/create`, (err, res, body) => {
                    expect(err).toBeNull();
                    ///expect res redirect to signin
                    done();
                });
            });
        });

        describe("POST /topics/:topicId/posts/:id/destroy", () => {
        
            it("should NOT delete the post with the associated ID", (done) => {
    
                request.post(`${base}/${this.topic.id}/posts/${this.post.id}/destroy`, (error, res, body) => {
    
                    Post.findById(1)
                    .then((post) => {
                        expect(error).toBeNull();
                        expect(post).not.toBeNull();
                        done();
                    })
                });
            });
        });
    
        describe("GET /topics/:topicId/posts/:id/edit", () => {
    
            it("should NOT render a view with an edit post form", (done) => {
                request.get(`${base}/${this.topic.id}/posts/${this.post.id}/edit`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Error");
                    done();
                });
            });
        });
    
        describe("POST /topics/:topicId/posts/:id/update", () => {

            it("should NOT update post with given values", (done) => {
                request.post(`${base}/${this.topic.id}/posts/${this.post.id}/update`, (err, res, body) => {
    
                    expect(err).toBeNull();
    
                    Post.findOne({where: {id: this.post.id}})
                    .then((post) => {
                        expect(post.title).toBe("Snowball Fighting"); ///confirm title did not change
                        done();
                    });
                });
            });
        });
        
    });

    //SIGNED-IN USER CONTEXT

    describe("Signed-in user with member role performing CRUD operations", () => {

    beforeEach((done) => {
        this.user;
        this.post;

        User.create({
            email: "member@example.com",
            password: "1234567",
            role: "member"
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

    describe("GET /topics/:topicId/posts/new", () => {

        it("should render a new post form", (done) => {
            request.get(`${base}/${this.topic.id}/posts/new`, (error, res, body) => {
                expect(error).toBeNull();
                expect(body).toContain("New Post");
                done();
            });
        });
    });

    describe("POST /topics/:topicId/posts/create", () => {
        
        it("should create a new post and redirect", (done) => {
            const options = {
                url: `${base}/${this.topic.id}/posts/create`,
                form: {
                    title: "Watching snow melt",
                    body: "Without a doubt my favorite thing to do besides watching paint dry!"
                }
            };
            request.post(options,
                (error, res, body) => {
                    Post.findOne({where: {title: "Watching snow melt"}})
                    .then((post) => {
                        expect(post.title).toBe("Watching snow melt");
                        expect(post.body).toBe("Without a doubt my favorite thing to do besides watching paint dry!");
                        done();
                    })
                    .catch((error) => {
                        console.log(error);
                        done();
                    });
                });
        });
    });

    describe("GET /topics/:topicId/posts/:id", () => {
        
        it("should render a view with the selected post", (done) => {
            request.get(`${base}/${this.topic.id}/posts/${this.post.id}`, (error, res, body) => {
                expect(error).toBeNull();
                expect(body).toContain("Snowball Fighting");
                done();
            });
        });
    });

    describe("POST /topics/:topicId/posts/:id/destroy", () => {
        
        it("should NOT delete the post with the associated ID", (done) => {

            request.post(`${base}/${this.topic.id}/posts/${this.post.id}/destroy`, (error, res, body) => {

                Post.findById(1)
                .then((post) => {
                    expect(error).toBeNull();
                    expect(post).not.toBeNull();
                    done();
                })
            });
        });
    });

    describe("GET /topics/:topicId/posts/:id/edit", () => {

        it("should NOT render a view with an edit post form", (done) => {
            request.get(`${base}/${this.topic.id}/posts/${this.post.id}/edit`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).not.toContain("New Post");
                expect(body).toContain("Error");
                done();
            });
        });
    });

    describe("POST /topics/:topicId/posts/:id/update", () => {

        it("should NOT update post with given values", (done) => {
            request.post(`${base}/${this.topic.id}/posts/${this.post.id}/update`, (err, res, body) => {

                expect(err).toBeNull();

                Post.findOne({where: {id: this.post.id}})
                .then((post) => {
                    expect(post.title).toBe("Snowball Fighting"); ///confirm title did not change
                    done();
                });
            });
        });
    });

});


    ///ADMIN CONTEXT

    describe("Admin user performing CRUD operations", () => {

        ///mock authorization
        beforeEach((done) => {
            User.create({
                email: "admin@example.com",
                password: "12345678",
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

        describe("GET /topics/:topicId/posts/new", () => {

            it("should render a new post form", (done) => {
                request.get(`${base}/${this.topic.id}/posts/new`, (error, res, body) => {
                    expect(error).toBeNull();
                    expect(body).toContain("New Post");
                    done();
                });
            });
        });
    
        describe("POST /topics/:topicId/posts/create", () => {
    
            it("should create a new post and redirect", (done) => {
                const options = {
                    url: `${base}/${this.topic.id}/posts/create`,
                    form: {
                        title: "Watching snow melt",
                        body: "Without a doubt my favorite thing to do besides watching paint dry!"
                    }
                };
                request.post(options,
                    (error, res, body) => {
                        Post.findOne({where: {title: "Watching snow melt"}})
                        .then((post) => {
                            expect(post.title).toBe("Watching snow melt");
                            expect(post.body).toBe("Without a doubt my favorite thing to do besides watching paint dry!");
                            done();
                        })
                        .catch((error) => {
                            console.log(error);
                            done();
                        });
                    });
            });
        });
    
        describe("GET /topics/:topicId/posts/:id", () => {
    
            it("should render a view with the selected post", (done) => {
                request.get(`${base}/${this.topic.id}/posts/${this.post.id}`, (error, res, body) => {
                    expect(error).toBeNull();
                    expect(body).toContain("Snowball Fighting");
                    done();
                });
            });
        });
    
        describe("POST /topics/:topicId/posts/:id/destroy", () => {
    
            it("should delete the post with the associated ID", (done) => {
    
                request.post(`${base}/${this.topic.id}/posts/${this.post.id}/destroy`, (error, res, body) => {
    
                    Post.findOne({where: {title: "Snowball Fighting"}})
                    .then((post) => {
                        expect(error).toBeNull();
                        expect(post).toBeNull();
                        done();
                    })
                });
            });
        });
    
        describe("GET /topics/:topicId/posts/:id/edit", () => {
    
            it("should render a view with an edit post form", (done) => {
                request.get(`${base}/${this.topic.id}/posts/${this.post.id}/edit`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Edit Post");
                    expect(body).toContain("Snowball Fighting");
                    done();
                });
            });
        });
    
        describe("POST /topics/:topicId/posts/:id/update", () => {
    
            it("should update the post with the given values", (done) => {
                const options = {
                    url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
                    form: {
                        title: "Snowman Building Competition",
                        body: "I love watching them melt slowly."
                    }
                };
                request.post(options, 
                    (err, res, body) => {
    
                        expect(err).toBeNull();
    
                        Post.findOne({where: {id: this.post.id}})
                        .then((post) => {
                            expect(post.title).toBe("Snowman Building Competition");
                            expect(post.body).toBe("I love watching them melt slowly.")
                            done();
                        });
                    });
            });
        });

    });

});

    
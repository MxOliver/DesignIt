const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("Topic", () => {

    beforeEach((done) => {

        this.topic;
        this.post;
        sequelize.sync({ force: true }).then((res) => {

            Topic.create({
                    title: "Amateur Beekeepers",
                    description: "A collection of resources for hopeful beekeepers."
                })
                .then((topic) => {
                    this.topic = topic;

                    Post.create({
                            title: "Does Whistling Calm the Bees?",
                            body: "No, but whistling may calm you and a calm beekeeper makes for calm bees.",
                            topicId: this.topic.id
                        })
                        .then((post) => {
                            this.post = post;
                            done();
                        });
                })
                .catch((error) => {
                    console.log(error);
                    done();
                });
        });
    });

    describe("#create()", () => {

        it("should create a new topic and store it in the database", (done) => {

            Topic.create({
                    title: "Meet Your Local Beekeepers",
                    description: "How to find and get in touch with local beekeepers."
                })
                .then((topic) => {

                    expect(topic.title).toBe("Meet Your Local Beekeepers");
                    expect(topic.description).toBe("How to find and get in touch with local beekeepers.");

                    Topic.findOne({
                            where: { title: "Meet Your Local Beekeepers" }
                        })
                        .then((topic) => {
                            expect(topic.description).toBe("How to find and get in touch with local beekeepers.");
                            expect(topic.title).toBe("Meet Your Local Beekeepers");
                            done();
                        })
                        .catch((error) => {
                            console.log(error);
                            done();
                        })

                });
        });
    });

    describe("#getPosts", () => {

        it("should return an array of associated posts", (done) => {

            Post.create({
                    title: "Why Should You Learn Beekeeping?",
                    body: "1. The outfits.",
                    topicId: this.topic.id
                })
                .then(() => {

                    this.topic.getPosts()
                        .then((posts) => {
                            expect(posts[0].topicId).toBe(this.topic.id);
                            expect(posts[0].title).toBe("Does Whistling Calm the Bees?");
                            expect(posts[1].topicId).toBe(this.topic.id);
                            expect(posts[1].title).toBe("Why Should You Learn Beekeeping?");
                            done();
                        })
                        .catch((error) => {
                            console.log(error);
                            done();
                        })
                });
        });
    });
});
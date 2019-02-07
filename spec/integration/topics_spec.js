const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";
const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;

describe("routes : topics", () => {

    beforeEach((done) => {
        this.topic;
        sequelize.sync({force: true}).then((res) => {

            Topic.create({
                title: "JS Frameworks",
                description: "There is a lot of them"
            })
            .then((topic) => {
                this.topic = topic;
                done();
            })
            .catch((error) => {
                console.log(error);
                done();
            })
        })
    })

    describe("GET /topics", () => {

        it("should return a status code 200 and all topics", (done) => {

            request.get(base, (error, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(error).toBeNull();
                expect(body).toContain("Topics");
                expect(body).toContain("JS Frameworks");
                done();
            });
        });
    });
});
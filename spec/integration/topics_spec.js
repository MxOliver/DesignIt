const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";

describe("routes : topics", () => {

    describe("GET /topics", () => {

        it("should return a status code 200", (done) => {
            request.get(base, (error, res, body) => {
                expect(res.statusCode).toBe(200);
                done();
            });
        });
    });
});
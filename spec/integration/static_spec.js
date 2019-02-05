const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/";
const marco = "http://localhost:3000/marco";

describe("routes : static", () => {

    describe("GET /", () => {

        it("should return status code 200", (done) => {
            
            request.get(base, (error, res, body) => {
                expect(res.statusCode).toBe(200);

                done();
            });
        });
    });

    describe("GET /marco", () => {

        it("should return status code 200", (done) => {
            
            request.get(marco, (error, res, body) => {
                expect(res.statusCode).toBe(200);

                done();
            });
        });

        it("should return the string 'polo'", (done) => {

            request.get(marco, (error, res, body) => {
                expect(res.body).toBe("polo");

                done();
            })
        })
    })
});
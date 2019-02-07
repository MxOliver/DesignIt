const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/advertisements/";

const sequelize = require("../../src/db/models/index").sequelize;
const Advertisement = require("../../src/db/models").Advertisement;


describe("routes : advertisements", () => {

    beforeEach((done) => {
        this.advertisement;
        sequelize.sync({ force: true }).then((res) => {

            Advertisement.create({
                    title: "Got milk?",
                    description: "It's good for the bones"
                })
                .then((advertisement) => {
                    this.advertisement = advertisement;
                    done();
                })
                .catch((error) => {
                    console.log(error);
                    done();
                });
        });
    });


    describe("GET /advertisements", () => {

        it("should return a status code of 200 and all advertisements", (done) => {

            request.get(base, (error, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(error).toBeNull();
                expect(body).toContain("Advertisements");
                expect(body).toContain("Got milk?");
                done();
            });
        });
    });

    describe("GET /advertisements/new", () => {

        it("should render a new advertisement form", (done) => {
            
            request.get(`${base}new`, (error, res, body) => {
                expect(error).toBeNull();
                expect(body).toContain("New Advertisement");
                done();
            })
        })
    });

    describe("POST /advertisements/create", () => {
        const options = {
            url:  `${base}create`,
            form: {
                title: "Skittles",
                description: "Taste the rainbow"
            }
        };

        it("should create a new advertisement and redirect", (done) => {

            request.post(options, 
                (error, res, body) => {
                    Advertisement.findOne({where: {title: "Skittles"}})
                    .then((advertisements) => {
                        expect(res.statusCode).toBe(303);
                        expect(advertisement.title).toBe("Skittles");
                        expect(advertisement.description).toBe("Taste the rainbow");
                        done();
                    })
                    .catch((error) => {
                        console.log(error);
                        done();
                    });
                });
        });
    });

    describe("GET /advertisements/:id", () => {

        it("should render a view with the selected advertisement", (done) => {
            request.get(`${base}${this.advertisement.id}`, (error, res, body) => {
                expect(error).toBeNull();
                expect(body).toContain("Got milk?");
                done();
            });
        });
    });

    describe("POST /advertisements/:id/destroy", () => {

        it("should delete the advertisement with the associated ID", (done) => {

            Advertisement.all()
            .then((advertisements) => {

                const advertisementCountBeforeDelete = advertisements.length;

                expect(advertisementCountBeforeDelete).toBe(1);

                request.post(`${base}${this.advertisement.id}/destroy`, (error, res, body) => {
                    Advertisement.all()
                    .then((advertisements) => {
                        expect(error).toBeNull();
                        expect(advertisements.length).toBe(advertisementCountBeforeDelete - 1);
                        done();
                    })
                });
            });

        });
    });

    describe("GET /advertisements/:id/edit", () => {

        it("should render a view with the edit advertisement form", (done) => {
            request.get(`${base}${this.advertisement.id}/edit`, (error, res, body) => {
                expect(error).toBeNull();
                expect(body).toContain("Edit Advertisement");
                expect(body).toContain("Got milk?");
                done();
            })
        });
    });

    describe("POST /advertisements/:id/update", () => {

        it("should update topic with given values", (done) => {
            const options = {
                url: `${base}${this.advertisement.id}/update`,
                form: {
                    title: "Got milk?",
                    description: "It's good for the bones"
                }
            };

            request.post(options, 
                (error, res, body) => {

                    expect(error).toBeNull();

                    Advertisement.findOne({
                        where: {id: this.advertisement.id}
                    })
                    .then((advertisement) => {
                        expect(advertisement.title).toBe("Got milk?");
                        done();
                    })
                })
        })
    })
});
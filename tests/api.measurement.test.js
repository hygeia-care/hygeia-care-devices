const Measurement = require('../models/measurement');
const app = require('../app');
const request = require('supertest');
const verifyToken = require('../verifyJWTToken');
const mongoose = require('mongoose');
const { connectDatabase, closeDatabase } = require('./setup'); // Adjust the path accordingly

jest.mock('../verifyJWTToken');

describe("measurement API", () => {

    describe("GET /measurement/:id", () => {
        const measurement = [
            new Measurement({ "id": "123456789", "title": "myTitle", "date": "01/01/01", "comment": "fdsfdsf", "type": "https://www.testassurance.com", "user": "me" }),
        ];
        var dbFind;

        beforeEach(() => {
            dbFind = jest.spyOn(Measurement, "find");
            verifyToken.mockReset();
        });

        it("Should return one measurement", () => {
            dbFind.mockImplementation(async () => Promise.resolve(measurement));
            verifyToken.mockImplementation(async () => Promise.resolve(null));

            return request(app).get("/api/v1/Measurement").then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body[0].title).toEqual("myTitle");
                expect(dbFind).toBeCalled();
                expect(verifyToken).toBeCalled();
            });
        });
    });

    // verifyToken.mockImplementation(async () => Promise.resolve(true));

    // const testJWT = "thisTokenWorks";

    // describe("GET /measurement", () => {
    //     const measurement = [
    //         new measurement({"id":"123456789", "title":"fdsfdsfd", "date": "01/01/01", "comment": "fdsfdsf", "type": "https://www.testassurance.com", "user": "me"}),

    //     ];
    //     var dbFind;

    //     beforeEach(() => {
    //         dbFind = jest.spyOn(measurement, "find");
    //     });

    //     it("Should return all assurance carriers", () => {
    //         dbFind.mockImplementation(async () => Promise.resolve(measurement));

    //         return request(app).get("/api/v1/measurement")
    //         .set("x-auth-token", testJWT)
    //         .then((response) => {
    //             expect(response.statusCode).toBe(200);
    //             expect(response.body).toBeArrayOfSize(1);
    //             expect(dbFind).toBeCalled();
    //         });
    //     });
    // });
});
const app = require('../app');
const request = require('supertest');
const measurement = require('../models/measurement');
const verifyJWTToken = require('../verifyJWTToken');

describe("measurement API", () => {

    verifyToken = jest.spyOn(verifyJWTToken, "verifyToken");
    verifyToken.mockImplementation(async () => Promise.resolve(true));

    const testJWT = "thisTokenWorks";

    describe("GET /measurement", () => {
        const measurement = [
            new measurement({"id":"123456789", "title":"fdsfdsfd", "date": "01/01/01", "comment": "fdsfdsf", "type": "https://www.testassurance.com", "user": "me"}),
        
        ];
        var dbFind;

        beforeEach(() => {
            dbFind = jest.spyOn(measurement, "find");
        });

        it("Should return all assurance carriers", () => {
            dbFind.mockImplementation(async () => Promise.resolve(measurement));

            return request(app).get("/api/v1/measurement")
            .set("x-auth-token", testJWT)
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(6);
                expect(dbFind).toBeCalled();
            });
        });
    });
});



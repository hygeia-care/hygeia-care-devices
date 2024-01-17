const app = require('../app');
const request = require('supertest');
const Analysis = require('../models/analysis');

describe("analysis API", () => {
    describe("GET /analysis/:id", () => {
        const analysis = [new Analysis({"value":"Testanalysis", "measurement":"meas34Rmnt_2024_XYZ"})];
        var dbFind;

        beforeEach(() => {
            dbFind = jest.spyOn(Analysis, "find");
            authorization = jest.spyOn(verifyJWTToken, "veryfyToken");
        });

        it("Should return all analysis", () => {
            dbFind.mockImplementation(async () => Promise.resolve(analysis));
            authorization.mockImplementation(async () => Promise.resolve(null));

            return request(app).get("/api/v1/Analysis").then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.value).toEqual("Testanalysis");
                expect(dbFind).toBeCalled();
                expect(authorization).toBeCalled();
            });
        });
    });
});


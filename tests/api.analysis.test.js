const app = require('../app');
const request = require('supertest');
const Analysis = require('../models/analysis');
const verifyToken = require('../verifyJWTToken');
const mongoose = require('mongoose');
const { connectDatabase, closeDatabase } = require('./dbConnection'); // Adjust the path accordingly


jest.mock('../verifyJWTToken'); 

describe("analysis API", () => {
    describe("GET /analysis/:id", () => {
        const analysis = [new Analysis({"value":"Testanalysis", "measurement":"meas34Rmnt_2024_XYZ"})];
        var dbFind;

        beforeAll(async () => {
            // Connect to the database before all tests
            await connectDatabase();
        });
        
        beforeEach(() => {
            dbFind = jest.spyOn(Analysis, "find");
            // Reset the mock before each test
            verifyToken.mockReset();
        });

        afterAll(async () => {
            // Close the database connection after all tests
            await closeDatabase();
        });

        it("Should return all analysis", () => {
            dbFind.mockImplementation(async () => Promise.resolve(analysis));
            verifyToken.mockImplementation(async () => Promise.resolve(null));

            return request(app).get("/api/v1/Analysis").then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body[0].value).toEqual("Testanalysis");
                expect(dbFind).toBeCalled();
                expect(verifyToken).toBeCalled();
            });
        });
    });
});

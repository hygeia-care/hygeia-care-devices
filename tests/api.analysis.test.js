const app = require('../app');
const request = require('supertest');
const Analysis = require('../models/analysis');
const verifyToken = require('../verifyJWTToken');

jest.mock('../verifyJWTToken');

describe("analysis API", () => {
    beforeEach(() => {
        // Reset the mock before each test
        verifyToken.mockReset();
    });

    describe("GET /analysis/:id", () => {
        const analysis = [new Analysis({ "value": "Testanalysis", "measurement": "meas34Rmnt_2024_XYZ" })];
        var dbFind;
        dbFind = jest.spyOn(Analysis, "find");


        it("Should return the analysis", () => {
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

    describe("DELETE /analysis/:id", () => {
        it("Should delete the analysis", async () => {
            const deleteOneMock = jest.spyOn(Analysis, "deleteOne").mockImplementation(async () => ({
                acknowledged: true,
                deletedCount: 1
            }));

            verifyToken.mockImplementation(async () => Promise.resolve(null));

            const response = await request(app)
                .delete("/api/v1/Analysis/some-id")
                .set('x-auth-token', 'some-token');

            expect(response.statusCode).toBe(200);
            expect(deleteOneMock).toBeCalledWith({ _id: "some-id" });
            expect(verifyToken).toBeCalledWith('some-token', expect.anything());
        });

        it("Should return 404 if analysis not found", async () => {
            const deleteOneMock = jest.spyOn(Analysis, "deleteOne").mockImplementation(async () => ({
                acknowledged: true,
                deletedCount: 0
            }));

            verifyToken.mockImplementation(async () => Promise.resolve(null));

            const response = await request(app)
                .delete("/api/v1/Analysis/nonexistent-id")
                .set('x-auth-token', 'some-token');

            expect(response.statusCode).toBe(404);
            expect(deleteOneMock).toBeCalledWith({ _id: "nonexistent-id" });
            expect(verifyToken).toBeCalledWith('some-token', expect.anything());
        });

        it("Should return 500 on database error", async () => {
            const deleteOneMock = jest.spyOn(Analysis, "deleteOne").mockImplementation(async () => {
                throw new Error("Database error");
            });

            verifyToken.mockImplementation(async () => Promise.resolve(null));

            const response = await request(app)
                .delete("/api/v1/Analysis/some-id")
                .set('x-auth-token', 'some-token');

            expect(response.statusCode).toBe(500);
            expect(deleteOneMock).toBeCalledWith({ _id: "some-id" });
            expect(verifyToken).toBeCalledWith('some-token', expect.anything());
        });
    });

    describe("POST /analysis", () => {
        it("Should create a new analysis", async () => {
            const saveMock = jest.spyOn(Analysis.prototype, "save").mockImplementation(async () => { });

            verifyToken.mockImplementation(async () => Promise.resolve(null));

            const response = await request(app)
                .post("/api/v1/Analysis")
                .set('x-auth-token', 'some-token')
                .send({
                    value: "NewAnalysis",
                    measurement: "meas123"
                });

            expect(response.statusCode).toBe(201);
            expect(saveMock).toBeCalled();
            expect(verifyToken).toBeCalledWith('some-token', expect.anything());
        });


        it("Should return 400 on validation problem", async () => {
            const saveMock = jest.spyOn(Analysis.prototype, "save").mockImplementation(async () => {
                // Simulate a validation error by throwing an error with 'errors' property
                throw { errors: { someField: { message: 'Validation error' } } };
            });
    
            verifyToken.mockImplementation(async () => Promise.resolve(null));
    
            const response = await request(app)
                .post("/api/v1/Analysis")
                .set('x-auth-token', 'some-token')
                .send({
                    // Missing required fields to trigger validation error
                });
    
            expect(response.statusCode).toBe(400);
            expect(saveMock).toBeCalled();
            expect(verifyToken).toBeCalledWith('some-token', expect.anything());
        });
    
        it("Should return 500 on database error", async () => {
            const saveMock = jest.spyOn(Analysis.prototype, "save").mockImplementation(async () => {
                throw new Error("Database error");
            });
    
            verifyToken.mockImplementation(async () => Promise.resolve(null));
    
            const response = await request(app)
                .post("/api/v1/Analysis")
                .set('x-auth-token', 'some-token')
                .send({
                    value: "NewAnalysis",
                    measurement: "meas123"
                });
    
            expect(response.statusCode).toBe(500);
            expect(saveMock).toBeCalled();
            expect(verifyToken).toBeCalledWith('some-token', expect.anything());
        });
    });

    describe("GET /analysis", () => {
        it("Should return all analyses for a given userId", async () => {
            const findMock = jest.spyOn(Analysis, "find").mockImplementation(async () => [
                new Analysis({ value: "Analysis1", measurement: "meas1" }),
                new Analysis({ value: "Analysis2", measurement: "meas2" })
            ]);

            verifyToken.mockImplementation(async () => Promise.resolve(null));

            const response = await request(app)
                .get("/api/v1/Analysis")
                .set('x-auth-token', 'some-token')
                .query({ userId: "some-user-id" });

            expect(response.statusCode).toBe(200);
            expect(findMock).toBeCalledWith({ user: "some-user-id" });
            expect(verifyToken).toBeCalledWith('some-token', expect.anything());
        });

        // Add more test cases for different scenarios (e.g., no userId, no analyses found, database error)
    });
});

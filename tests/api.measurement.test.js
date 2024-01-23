const Measurement = require('../models/measurement');
const app = require('../app');
const request = require('supertest');
const verifyToken = require('../verifyJWTToken');
const axios = require('axios');

jest.mock('../verifyJWTToken');
jest.mock('axios');

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

        it("Should return 404 if measurement by ID not found", async () => {
            const findMock = jest.spyOn(Measurement, "find").mockImplementation(async () => []);

            verifyToken.mockImplementation(async () => Promise.resolve(null));

            const response = await request(app)
                .get("/api/v1/measurement/nonexistent-id")
                .set('x-auth-token', 'some-token');

            expect(response.statusCode).toBe(404);
            expect(findMock).toBeCalledWith({ _id: "nonexistent-id" });
            expect(verifyToken).toBeCalledWith('some-token', expect.anything());
            expect(response.body.message).toBe('No measurement found with the given id: nonexistent-id');
        });
    });

    describe("GET /measurement", () => {
        it("Should return all measurements", async () => {
            const findMock = jest.spyOn(Measurement, "find").mockImplementation(async () => [
                new Measurement({ "title": "Measurement1", "date": "01/01/01", "comment": "Comment1", "type": "BloodPressure", "user": "me" }),
                new Measurement({ "title": "Measurement2", "date": "02/02/02", "comment": "Comment2", "type": "BloodSugar", "user": "me" })
            ]);

            verifyToken.mockImplementation(async () => Promise.resolve(null));

            const response = await request(app)
                .get("/api/v1/measurement")
                .set('x-auth-token', 'some-token');

            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(2);
            expect(findMock).toBeCalled();
            expect(verifyToken).toBeCalledWith('some-token', expect.anything());
        });
    });

    describe("POST /measurement", () => {
        it("Should create a new measurement", async () => {
            const saveMock = jest.spyOn(Measurement.prototype, "save").mockImplementation(async () => {});

            axios.get.mockResolvedValue({ data: {} }); // Mock user service response

            verifyToken.mockImplementation(async () => Promise.resolve(null));

            const response = await request(app)
                .post("/api/v1/measurement")
                .set('x-auth-token', 'some-token')
                .send({
                    title: "New Measurement",
                    date: "03/03/03",
                    comment: "New Comment",
                    type: "BloodPressure",
                    user: "some-user-id"
                });

            expect(response.statusCode).toBe(201);
            expect(saveMock).toBeCalled();
            expect(verifyToken).toBeCalledWith('some-token', expect.anything());
        });

        it("Should return 404 if user not found", async () => {
            axios.get.mockRejectedValue({ errors: true }); // Mock user not found

            verifyToken.mockImplementation(async () => Promise.resolve(null));

            const response = await request(app)
                .post("/api/v1/measurement")
                .set('x-auth-token', 'some-token')
                .send({
                    title: "New Measurement",
                    date: "03/03/03",
                    comment: "New Comment",
                    type: "BloodPressure",
                    user: "nonexistent-user-id"
                });

            expect(response.statusCode).toBe(404);
            expect(response.body.error).toBe("Measurement not created because no user was found with id nonexistent-user-id");
            expect(verifyToken).toBeCalledWith('some-token', expect.anything());
        });

    });

    describe("PATCH /measurement/:id", () => {
        it("Should update measurement by ID", async () => {
            const updateOneMock = jest.spyOn(Measurement, "updateOne").mockImplementation(async () => ({
                acknowledged: true
            }));

            const findMock = jest.spyOn(Measurement, "find").mockImplementation(async () => [
                new Measurement({ "_id": "some-id", "title": "New Title", "date": "01/01/01", "comment": "Old Comment", "type": "BloodPressure", "user": "me" })
            ]);

            verifyToken.mockImplementation(async () => Promise.resolve(null));

            const response = await request(app)
                .patch("/api/v1/measurement/some-id")
                .set('x-auth-token', 'some-token')
                .send({
                    title: "New Title"
                });

            expect(response.statusCode).toBe(200);
            expect(updateOneMock).toBeCalledWith({ _id: "some-id" }, { $set: { title: "New Title" } });
            expect(findMock).toBeCalledWith({ _id: "some-id" });
            expect(verifyToken).toBeCalledWith('some-token', expect.anything());
            expect(response.body.title).toBe("New Title");
        });

        it("Should handle database update error", async () => {
            const updateOneMock = jest.spyOn(Measurement, "updateOne").mockImplementation(async () => {
                throw new Error("Database update error");
            });

            const findMock = jest.spyOn(Measurement, "find").mockImplementation(async () => [
                new Measurement({ "_id": "some-id", "title": "Old Title", "date": "01/01/01", "comment": "Old Comment", "type": "BloodPressure", "user": "me" })
            ]);

            verifyToken.mockImplementation(async () => Promise.resolve(null));

            const response = await request(app)
                .patch("/api/v1/measurement/some-id")
                .set('x-auth-token', 'some-token')
                .send({
                    title: "New Title"
                });

            expect(response.statusCode).toBe(500);
            expect(updateOneMock).toBeCalledWith({ _id: "some-id" }, { $set: { title: "New Title" } });
            expect(findMock).toBeCalledWith({ _id: "some-id" });
            expect(verifyToken).toBeCalledWith('some-token', expect.anything());
        });
    });

    describe("POST /measurement/exportStandardized/:measurementId", () => {
        it("Should export standardized measurement using Google Healthcare API", async () => {
            const findMock = jest.spyOn(Measurement, "find").mockImplementation(async () => [
                new Measurement({ "_id": "some-id", "comment": "Sample comment for export" })
            ]);

            axios.post.mockResolvedValue({ data: { result: "Exported data" } }); // Mock Google Healthcare API response

            verifyToken.mockImplementation(async () => Promise.resolve(null));

            const response = await request(app)
                .post("/api/v1/measurement/exportStandardized/some-id")
                .set('x-auth-token', 'some-token');

            expect(response.statusCode).toBe(201);
            expect(findMock).toBeCalledWith({ _id: "some-id" });
            expect(verifyToken).toBeCalledWith('some-token', expect.anything());
            expect(response.body.result).toBe("Exported data");
        });

        it("Should return 404 if measurement for export not found", async () => {
            const findMock = jest.spyOn(Measurement, "find").mockImplementation(async () => []);

            verifyToken.mockImplementation(async () => Promise.resolve(null));

            const response = await request(app)
                .post("/api/v1/measurement/exportStandardized/nonexistent-id")
                .set('x-auth-token', 'some-token');

            expect(response.statusCode).toBe(404);
            expect(findMock).toBeCalledWith({ _id: "nonexistent-id" });
            expect(verifyToken).toBeCalledWith('some-token', expect.anything());
            expect(response.body.message).toBe('No measurement found with the given id');
        });

        it("Should handle Google Healthcare API communication error", async () => {
            const findMock = jest.spyOn(Measurement, "find").mockImplementation(async () => [
                new Measurement({ "_id": "some-id", "comment": "Sample comment for export" })
            ]);

            axios.post.mockRejectedValue(new Error("Google Healthcare API error")); // Mock Google Healthcare API error

            verifyToken.mockImplementation(async () => Promise.resolve(null));

            const response = await request(app)
                .post("/api/v1/measurement/exportStandardized/some-id")
                .set('x-auth-token', 'some-token');

            expect(response.statusCode).toBe(500);
            expect(findMock).toBeCalledWith({ _id: "some-id" });
            expect(verifyToken).toBeCalledWith('some-token', expect.anything());
            expect(response.body.error).toBe('Error communicating with google healthcare API: Google Healthcare API error');
        });
    });
});
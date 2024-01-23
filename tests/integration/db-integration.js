const Analysis = require('../../models/analysis')
const dbConnect = require('../../db')

jest.setTimeout(10000); 

describe('Analysis DB connection', () => {
    beforeAll((done) => {
        if (dbConnect.readyState == 1) {
            done();
        } else {
            dbConnect.on("connected", () => done());
        }
    })

    beforeEach(async () => {
        await Analysis.deleteMany({});
    });

    it('writes a analysis in the DB', async () =>{
        const analysis = new Analysis({value:'123456', measurement: 'abc'});
        await analysis.save();
        analysisReturned = await Analysis.find();
        expect(analysisReturned).toBeArrayOfSize(1);

    });

    afterAll(async () => {
        if (dbConnect.readyState == 1) {
            await dbConnect.dropDatabase();
            await dbConnect.close();
        }
    });
});
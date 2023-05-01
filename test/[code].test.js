import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js';
import connectMongo from "../utils/connectMongo.js";
import Urls from "../models/urls.js";

chai.use(chaiHttp);

const { expect } = chai;

describe('Test for [code].js handler', () => {
    let tableName = 'test-table';
    let code = '';

    before(async () => {
        await chai
            .request(server)
            .post(`/api/${tableName}/url`)
            .send({ url: 'https://www.google.com' })
            .then((res) => {
                code = res.body.code;
            });
        await connectMongo();
    });

    after(async () => {
        await Urls(tableName).deleteMany({});
    });

    describe('GET /api/:tableName/:code', () => {
        it('should return the original URL when given a valid code', async () => {
            await chai
                .request(server)
                .get(`/api/${tableName}/${code}`)
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.equal('https://www.google.com');
                });
        });

        it('should return a 404 status when given an invalid code', async () => {
            await chai
                .request(server)
                .get(`/api/${tableName}/bla-bla-bla`)
                .then((res) => {
                    expect(res).to.have.status(404);
                    expect(res).to.be.json;
                    expect(res.body).to.equal('Incorrect url');
                });
        });
    });

    describe('DELETE /api/:tableName/:code', () => {
        it('should return a 404 status when given an invalid code', async () => {
            await chai
                .request(server)
                .delete(`/api/${tableName}/bla-bla-bla`)
                .then((res) => {
                    expect(res).to.have.status(404);
                });
        });

        it('should delete the URL when given a valid code', async () => {
            await chai
                .request(server)
                .delete(`/api/${tableName}/${code}`)
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.equal('Deleted successfully');
                });
        });
    });
});
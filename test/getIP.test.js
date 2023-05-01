import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js';

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET /', () => {
    it('should return the IP address of the requester', (done) => {
        chai.request(server)
            .get('/api/getIP')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.not.be.null;
                done();
            });
    });

    it('should return 404 for non-GET requests', (done) => {
        chai.request(server)
            .post('/api/getIP')
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });
});
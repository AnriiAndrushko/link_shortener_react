import chai from "chai";
import chaiHttp from "chai-http";
import connectMongo from "../utils/connectMongo.js";
import Urls from "../models/urls.js";
import {nanoid} from "nanoid";
import server from "../server.js";

chai.use(chaiHttp);
chai.should();

describe("Urls API", () => {
    let tableName = "test-table";
    let serv;
    before(async () => {
        await connectMongo();
    });

    beforeEach(async () => {
        await Urls(tableName).deleteMany({});
    });

    describe("GET /api/:tableName/url", () => {
        it("should get all URLs owned by the userIP", async () => {
            const userIP = "127.0.0.1";
            await Urls(tableName).create({
                code: nanoid(8),
                url: "https://example.com",
                owner: userIP,
            });

            const res = await chai.request(server).get(`/api/${tableName}/url?userIP=${userIP}`);
            res.should.have.status(200);
            res.body.should.be.an("array");
            res.body.length.should.be.eql(1);
        });

        it("should get all URLs for 'All' owner", async () => {
            const userIP = "127.0.0.1";
            await Urls(tableName).create({
                code: nanoid(8),
                url: "https://example.com",
                owner: "All",
            });

            const res = await chai.request(server).get(`/api/${tableName}/url?userIP=${userIP}`);
            res.should.have.status(200);
            res.body.should.be.an("array");
            res.body.length.should.be.eql(1);
        });
    });

    describe("POST /api/:tableName/url", () => {
        it("should create a new URL", async () => {
            const userIP = "127.0.0.1";
            const url = { url: "https://example.com", userIP };
            const res = await chai.request(server).post(`/api/${tableName}/url`).send(url);
            res.should.have.status(201);
            res.body.should.be.an("object");
            res.body.should.have.property("url").eql("https://example.com");
            res.body.should.have.property("code");
            res.body.should.have.property("owner").eql(userIP);
        });

        it("should return an error if URL is not provided", async () => {
            const userIP = "127.0.0.1";
            const url = { userIP };
            const res = await chai.request(server).post(`/api/${tableName}/url`).send(url);
            res.should.have.status(400);
            res.body.should.be.a("string");
            res.body.should.be.eql("Url is not provided");
        });
    });
});
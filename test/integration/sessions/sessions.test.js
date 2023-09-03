import {expect, use} from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import assert from 'assert';

import { user1, user2 } from '../../mocks/sessions.mock.js';

const requester = supertest('http://localhost:8080')
describe('Testing sessions routes',()=>{

    beforeEach(async()=>{
        const result = await requester.post('/users/login').send(user2);
    })

    it('It should return a page with the register form',async ()=>{
        
        const result = await requester.get('/users/register').send();

        expect(result.ok).to.be.true;
        expect(result.statusCode).to.deep.equal(200);
        expect(result.body).to.be.an('object');
    })

    it('It should register a new user',async ()=>{
        
        const result = await requester.post('/users/register').send(user1);

        expect(result.statusCode).to.deep.equal(302);
        expect(result.body).to.be.an('object');
    })

    it('It should log a new user',async ()=>{
        
        const result = await requester.post('/users/login').send(user2);

        expect(result.statusCode).to.deep.equal(302);
        expect(result.body).to.be.an('object');
    })
    it('It should destroy the session and go back to the login form',async ()=>{
        
        const result = await requester.get('/users/logout').send();

        expect(result.ok).to.be.false;
        expect(result.statusCode).to.deep.equal(302);
    })
    it('It should destroy the session and go back to the login form',async ()=>{
        
        const result = await requester.get('/users/passwordRecover').send();

        expect(result.ok).to.be.true;
        expect(result.statusCode).to.deep.equal(302);
    })
})

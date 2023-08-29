import {expect, use} from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import assert from 'assert';

import { cid, pid, cart1 } from '../../mocks/carts.mock.js';

const requester = supertest('http://localhost:8080')
describe('Testing carts routes',()=>{

    it('It should return all the carts on the database',async ()=>{
        
        const result = await requester.get('/api/carts').send();

        expect(result.ok).to.be.true;
        expect(result.statusCode).to.deep.equal(200);
        expect(result.body).to.be.an('array');
    })

    it('It should return the cart based on the ID',async ()=>{
        
        const result = await requester.get('/api/carts/'+cid).send();

        expect(result.ok).to.be.true;
        expect(result.statusCode).to.deep.equal(200);
        expect(result.body).to.be.an('object');
    })

    it('It should create an empty cart',async ()=>{
        
        const result = await requester.post('/api/carts').send();

        expect(result.ok).to.be.true;
        expect(result.statusCode).to.deep.equal(200);
        expect(result.body).to.be.an('object');
        expect(result.body).to.have.property('_id')
    })

    it('It should return a 403 error because of a missing jwt',async ()=>{
        
        const result = await requester.post('/api/carts/'+cid+'/products/'+pid).send();

        expect(result.ok).to.be.false;
        expect(result.statusCode).to.deep.equal(403);
    })

    it('It should delete the given product on the cart',async ()=>{
        
        const result = await requester.delete('/api/carts/'+cid+'/products/'+pid).send();

        expect(result.ok).to.be.true;
        expect(result.statusCode).to.deep.equal(200);
    })

    it('It should delete all the products on the given card',async ()=>{
        
        const result = await requester.delete('/api/carts/'+cid).send();

        expect(result.ok).to.be.true;
        expect(result.statusCode).to.deep.equal(200);

    })

    it('It should update the cart with the product sent on the body',async ()=>{
        
        const result = await requester.put('/api/carts/'+cid).send(cart1);

        expect(result.ok).to.be.true;
        expect(result.statusCode).to.deep.equal(200);
        expect(result.body).to.be.an('object');
        expect(result.body).to.have.property('_id')

    })
})
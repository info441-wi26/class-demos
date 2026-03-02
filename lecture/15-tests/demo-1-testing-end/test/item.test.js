import { assert } from 'chai'
import request from 'supertest'

// I want to test item.js, so I am going ot import
// the app, which I need to get to it
import app from '../app.js'

describe("Items integration test (with database)", () => {
    it("should get items from the db for GET items", async () => {
        const res = await request(app).get("/items")

        assert.equal(res.statusCode, 200)
        assert.equal(res.type, "application/json")

        assert.isArray(res.body)
        assert.include(res.body[0], {
            name: 'orange',
            price: 1.99
        })
    })
})

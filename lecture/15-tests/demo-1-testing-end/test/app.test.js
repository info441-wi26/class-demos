import { assert } from 'chai'
import request from 'supertest'

// I want to test app.js, so I import it
import app from '../app.js'

describe('Static Server', () => {
    it('should return index.html if default path is requested', async () => {
        const res = await request(app).get("/")

        assert.equal(res.statusCode, 200)

        assert.include(
            res.text,
            '<script src="javascripts/index.js" ></script>',
            "body has html code we recognize as from index.html"
        )
    })

    it('should return 404 for a non-existent file', async () => {
        const res = await request(app).get("/saeyresaijfdsaoifdsa.html")

        assert.equal(res.statusCode, 404)
    })
})
import test from 'node:test'
import assert from 'node:assert'
import { promisify } from 'node:util'

test('Hero Integration Test Suite', async (t) => {
    const testPort = 9009

    //bad practice cause mutates the environment
    process.env.PORT = testPort
    const {server} = await import('../../src/index.js')

    const testServerAddress = `http://localhost:${testPort}/heroes`

    await t.test('It should create a hero', async (t) => {
        const data = {
            name: "Batman",
            age: 50,
            power: "rich"
        }

        const request = await fetch(testServerAddress, {
            method: 'POST',
            body: JSON.stringify(data)
        })

        assert.deepStrictEqual(
            request.headers.get('content-type'),
            'application/json'
        )

        assert.strictEqual(request.status, 201)

    })

    await promisify(server.close.bind(server))
})
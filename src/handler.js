import {parse} from 'node:url'
import { DEFAULT_HEADER } from './util/util.js'

const allRoutes = {
    '/heroes:get': async (request, response) => {
        response.write('GET')
        response.end()
    },

    //404 routes
    default: (request, response) =>{
        response.writeHead(404, DEFAULT_HEADER)
        response.write('Oops. Not found!')
        response.end()
    }

}

function handler(request, response){
    const{
        url,
        method
    } = request

    const {
        pathname
    } = parse(url, true)
    const key = `${pathname}:${method.toLowerCase()}`
    const chosen = allRoutes[key] || allRoutes.default

    return Promise.resolve(chosen(request, response))
    .catch(handlerError(response))
}

function handlerError(response){
    return error => {
        console.log('Something bad has happened', error.stack)
        response.writeHead(500, DEFAULT_HEADER)
        response.write(JSON.stringify({
            error: 'internal server error!'
        }))

        return response.end()
    }
}

export default handler
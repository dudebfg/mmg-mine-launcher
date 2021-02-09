/**
 * Mojang
 *
 * This module serves as a minimal wrapper for Mojang's REST api.
 *
 * @module mojang
 */
// Requirements
const request = require('request')
const logger  = require('./loggerutil')('%c[Mojang]', 'color: #a02d2a; font-weight: bold')
const uuidv4 = require('uuid').v4;

// Constants
const minecraftAgent = {
    name: 'Minecraft',
    version: 1
}
const authpath = 'https://authserver.ely.by'

/**
 * Authenticate a user with their Mojang credentials.
 *
 * @param {string} username The user's username, this is often an email.
 * @param {string} password The user's password.
 * @param {string} clientToken The launcher's Client Token.
 *
 * @see http://wiki.vg/Authentication#Authenticate
 */
exports.authenticate = function(username, password, clientToken = true,){
    return new Promise((resolve, reject) => {

        const body = {
            username,
            password

        }
        if(clientToken != null){
            body.clientToken = clientToken
        } else {
            body.clientToken = uuidv4()
        }

        console.log( body )

        request.post(authpath + '/auth/authenticate',
            {
                json: true,
                body
            },
            function(error, response, body){
                console.log( error, response, body )

                if(error){
                    logger.error('Error during authentication.', error)
                    reject(error)
                } else {
                    if(response.statusCode === 200){
                        resolve(body)
                    } else {
                        reject(body || {code: 'ENOTFOUND'})
                    }
                }
            })
    })
}


const socketio = require('socket.io')
const express = require('express')
const http = require('http')
const emoji = require('node-emoji')
const { helpMessage } = require('./message')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT


io.on("connection", (socket) => {
    console.log('New Websocket connection')    

    socket.emit('message', `${emoji.emojify('Welcome! I am a Postman Help Bot :smile:')}`)

    socket.on('help', (message, callback) => {

        if (callback) {
            callback(`OK! I am searching for ${message} ${emoji.emojify(':mag_right:')}`)    
        }

        helpMessage(message).then((responses) => {
            if (Array.isArray(responses)) {
                let i = 0

                const messageLoop = () => {
                    socket.emit('message', `I have found this page: ${new URL(responses[i].link)} that might help you ${emoji.emojify(':wink:')}. Here's a snippet: ${responses[i].text}`)
                    socket.emit('message', 'Was it helpful?')  
                    i++
                }

                if (i === 0)  messageLoop()

                socket.on('answer', (answer) => {
                    if (i < responses.length && answer.toLowerCase() === 'no') {
                        messageLoop()
                    } else if (answer.toLowerCase() === 'yes') {
                        socket.emit('message', `Great! Happy to help ${emoji.emojify(':hugging_face:')}`)
                    } else {
                        socket.emit('message', `Sorry ${emoji.emojify(':slightly_frowning_face:')} Please try a different search word.`)
                    }
                })                             

                            
            } else {
                socket.emit('message', responses)
            }
        })
    })

    // Room events
    io.of("/").adapter.on("create-room", (room) => {
        console.log(`room ${room} was created`)
      })
    io.of("/").adapter.on("delete-room", (room) => {
        console.log(`room ${room} was deleted`)
    })

})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})


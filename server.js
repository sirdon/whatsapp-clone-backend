const app = require('express')();

const server = require('http').createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {
    const id = socket.handshake.query.id;
    socket.join(id)
    socket.on('send-message', ({ recipients, text }) => {
        recipients.forEach(recipient => {
            const newRecipients = recipients.filter(r => r !== recipient);
            newRecipients.push(id);
            socket.broadcast.to(recipient).emit('receive-message', {
                recipients: newRecipients, sender:id, text
            })
        })
    })
})
// io.on('connection', (socket) => {
//     console.log("what is socket: " , socket);
//     socket.on('chat', (payload) => {
//         console.log("what is payload: char " , payload);
//         io.emit('chat', payload)
//     })
//     socket.on('signal', (payload) => {
//         console.log("what is payload: signal " , payload);
//         io.emit('chat', payload)
//     })
// })

server.listen(5000, () => {
    console.log("listening on port 5000")
})
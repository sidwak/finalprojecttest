import { Server } from 'socket.io'
const io = new Server(3001, {
  cors: {
    origin: '*', // Allow all origins; customize this for production
  },
})

io.on('connection', (socket) => {
  console.log('A client connected:', socket.id)
  socket.on('cmdExe', (data) => {
    console.log(`Message from ${socket.id}: ${data}`)
    socket.broadcast.emit('broadcast', { sender: socket.id, message: data })
  })
  socket.on('hello', (data) => {
    console.log(data)
  })
})

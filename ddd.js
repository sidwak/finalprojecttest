import { io } from 'socket.io-client'
const socket = io('http://localhost:3001')
socket.on('connect', () => {
  console.log('Connected to server with ID:', socket.id)
  socket.emit('cmdExe', 'This test is about to start...')
  socket.emit('hello', 'world')
})
socket.on('connect_error', (err) => {
  console.error('Connection error:', err)
})

console.log('hhh')

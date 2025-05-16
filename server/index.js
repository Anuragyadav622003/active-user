require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { initializeSocket } = require('./socketManager');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_URL || 'https://active-user-9pqg.vercel.app/',
  credentials: true
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'https://active-user-9pqg.vercel.app/',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Initialize socket handling with the imported function
initializeSocket(io);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.get("/",(req,res)=>{
res.send("Welcome to server");
});
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

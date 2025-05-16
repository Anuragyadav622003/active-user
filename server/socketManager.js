function initializeSocket(io) {
  // Map to store socket connections: socketId -> { userId, lastActive }
  const socketConnections = new Map();
  
  // Map to store user sessions: userId -> Set of socketIds
  const userSessions = new Map();

  // Define broadcast function at the top level
  function broadcastActiveUsers() {
    try {
      // Count unique users (not connections)
      const count = userSessions.size;
      
      console.log(`Broadcasting active users count: ${count}`);
      
      io.emit('active-users', {
        count,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error broadcasting active users:', error);
    }
  }

  // Log active users (for debugging)
  function logActiveUsers() {
    console.log(`Active unique users (${userSessions.size}):`, [...userSessions.keys()]);
    console.log('User sessions:', [...userSessions.entries()].map(([userId, sockets]) => 
      `${userId}: ${sockets.size} connections`
    ));
  }

  io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    // Authentication handler
    socket.on('authenticate', (userId) => {
      if (!userId) {
        console.warn(`Socket ${socket.id} tried to authenticate without a userId`);
        return;
      }
      
      // Store socket connection
      socketConnections.set(socket.id, {
        userId,
        lastActive: Date.now()
      });
      
      // Add socket to user's sessions
      if (!userSessions.has(userId)) {
        userSessions.set(userId, new Set());
      }
      userSessions.get(userId).add(socket.id);
      
      console.log(`User ${userId} authenticated with socket ${socket.id}`);
      logActiveUsers();
      broadcastActiveUsers();
    });

    // Heartbeat handler
    const heartbeatInterval = setInterval(() => {
      if (socketConnections.has(socket.id)) {
        const userData = socketConnections.get(socket.id);
        socketConnections.set(socket.id, {
          ...userData,
          lastActive: Date.now()
        });
      }
    }, 30000); // 30 seconds

    // Disconnection handler
    socket.on('disconnect', () => {
      clearInterval(heartbeatInterval);
      
      if (socketConnections.has(socket.id)) {
        const { userId } = socketConnections.get(socket.id);
        console.log(`User ${userId} disconnected from socket ${socket.id}`);
        
        // Remove socket from connections
        socketConnections.delete(socket.id);
        
        // Remove socket from user sessions
        if (userSessions.has(userId)) {
          const userSocketSet = userSessions.get(userId);
          userSocketSet.delete(socket.id);
          
          // If user has no more active sessions, remove user
          if (userSocketSet.size === 0) {
            userSessions.delete(userId);
            console.log(`User ${userId} has no more active sessions and was removed`);
          }
        }
        
        logActiveUsers();
        broadcastActiveUsers();
      } else {
        console.log(`Unauthenticated socket disconnected: ${socket.id}`);
      }
    });
  });

  // Cleanup inactive sockets every minute
  setInterval(() => {
    const now = Date.now();
    let cleanedUp = false;
    
    // Check each socket connection
    socketConnections.forEach((data, socketId) => {
      if (now - data.lastActive > 90000) { // 90 seconds
        const { userId } = data;
        console.log(`Cleaning up inactive socket ${socketId} for user ${userId}`);
        
        // Remove socket from connections
        socketConnections.delete(socketId);
        
        // Remove socket from user sessions
        if (userSessions.has(userId)) {
          const userSocketSet = userSessions.get(userId);
          userSocketSet.delete(socketId);
          
          // If user has no more active sessions, remove user
          if (userSocketSet.size === 0) {
            userSessions.delete(userId);
            console.log(`User ${userId} has no more active sessions and was removed`);
          }
        }
        
        cleanedUp = true;
      }
    });
    
    if (cleanedUp) {
      logActiveUsers();
      broadcastActiveUsers();
    }
  }, 60000);
}

module.exports = { initializeSocket };

import { Server, Socket } from 'socket.io';

export const initSocket = (io: Server) => {
  console.log('Socket logic initialized. Waiting for connections...');

  io.on('connection', (socket: Socket) => {
    console.log(`Connected with socket ${socket.id} `);

    socket.on('disconnect', reason => {
      console.log(`Disconnected with socket ${socket.id}`, reason);
    });
  });
};

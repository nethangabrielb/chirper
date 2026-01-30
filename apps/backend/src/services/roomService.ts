import { Room } from '@twitter-clone/shared';

import roomRepository from '../repositories/roomRepository';

const roomService = {
  createRoom: async (room: Room) => {
    const roomReturned = await roomRepository.create(room);
    if (!roomReturned) {
      throw new Error('Error fetching the database');
    }
    return roomReturned;
  },
};

export default roomService;

import { Room } from '@twitter-clone/shared';

import roomRepository from '../repositories/roomRepository';

const roomService = {
  createRoom: async (room: Room) => {
    const users = room.users;

    const usersHasRooms = await roomRepository.findByUsers(users);

    if (usersHasRooms) {
      throw new Error('Room already exists');
    } else {
      const roomReturned = await roomRepository.create(room);
      if (!roomReturned) {
        throw new Error('Error fetching the database');
      }
      return roomReturned;
    }
  },
  getUserRooms: async (userId: number) => {
    const rooms = await roomRepository.findByUserId(userId);
    if (!rooms) {
      throw new Error('Error fetching the database');
    }
    return rooms;
  },
};

export default roomService;

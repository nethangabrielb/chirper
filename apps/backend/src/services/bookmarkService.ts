import bookmarkRepository from '../repositories/bookmarkRepository';

const bookmarkService = {
  create: async (userId: number, postId: number) => {
    const bookmark = await bookmarkRepository.create(userId, postId);
    if (!bookmark) {
      throw new Error('There was an issue bookmarking');
    }
    return bookmark;
  },
};

export default bookmarkService;

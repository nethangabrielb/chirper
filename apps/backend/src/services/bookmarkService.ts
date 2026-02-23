import bookmarkRepository from '../repositories/bookmarkRepository';

const bookmarkService = {
  create: async (userId: number, postId: number) => {
    const bookmark = await bookmarkRepository.create(userId, postId);
    if (!bookmark) {
      throw new Error('There was an issue bookmarking');
    }
    return bookmark;
  },
  delete: async (bookmarkId: number) => {
    return bookmarkRepository.delete(bookmarkId);
  },
  findById: async (bookmarkId: number) => {
    const bookmark = await bookmarkRepository.findById(bookmarkId);
    if (!bookmark) {
      throw new Error('Bookmark not found');
    }
    return bookmark;
  },
};

export default bookmarkService;

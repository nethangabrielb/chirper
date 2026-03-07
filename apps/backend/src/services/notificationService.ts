import notificationRepository from '../repositories/notificationRepository';

const notificationService = {
  getAll: async (userId: number) => {
    const notifications = await notificationRepository.findAll(userId);
    if (!notifications) {
      throw new Error('Error fetching notifications');
    }
    return notifications;
  },
};

export default notificationService;

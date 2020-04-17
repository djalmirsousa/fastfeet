import Bee from 'bee-queue';
import DeliveryAvailableMail from '../App/Jobs/deliveryAvailableMail';
import DeliveryCancelledMail from '../App/Jobs/deliveryCancelledMail';
import redisConfig from '../Config/redis';

const jobs = [DeliveryAvailableMail, DeliveryCancelledMail];

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    // eslint-disable-next-line no-console
    console.log(`Queue${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();

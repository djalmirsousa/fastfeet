import createSession from '../Services/CreateSessionService';

export default {
  async store(req, res) {
    return res.json(await createSession.run(req.body));
  },
};

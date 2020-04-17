import CreateUser from '../Services/CreateUserService';
import UpdateUser from '../Services/UpdateUserService';

export default {
  async store(req, res) {
    return res.json(await CreateUser.run(req.body));
  },
  async update({ body, params, auth }, res) {
    return res.json(await UpdateUser.run({ ...params, auth }, body));
  },
};

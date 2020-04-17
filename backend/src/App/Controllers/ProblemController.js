import CreateProblem from '../Services/CreateProblemService';

import ListProblem from '../Repository/ListProblemRepository';

export default {
  async index({ params, query, url }, res) {
    const { page, quantity, scopes } = query;
    const scopesJson = scopes ? JSON.parse(scopes) : [];
    return res.json(
      await ListProblem.run(
        params,
        { page, quantity, scopes: scopesJson },
        { url }
      )
    );
  },

  async store({ body, url, params: { deliveryId: delivery_id } }, res) {
    return res.json(await CreateProblem.run({ ...body, delivery_id }, { url }));
  },
};

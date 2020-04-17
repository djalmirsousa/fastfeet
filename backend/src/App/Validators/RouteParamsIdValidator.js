import * as Yup from 'yup';

export default id => async ({ params }, res, next) => {
  if (!Array.isArray(id)) {
    throw new Error("isn't a Array");
  }
  try {
    let object = {};

    id.forEach(e => {
      object = {
        ...object,
        [e]: Yup.number()
          .positive()
          .required(),
      };
    });

    const schema = Yup.object().shape({
      ...object,
    });

    await schema.validate(params, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: err.inner });
  }
};

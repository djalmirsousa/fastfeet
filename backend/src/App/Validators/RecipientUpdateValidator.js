import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object()
      .shape({
        name: Yup.string().min(3),
        street: Yup.string(),
        number: Yup.number().positive(),
        complement: Yup.string(),
        state: Yup.string(),
        city: Yup.string(),
        zip: Yup.string().matches(new RegExp(/^[0-9]{5}-[0-9]{3}$/)),
      })
      .required();

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: err.inner });
  }
};

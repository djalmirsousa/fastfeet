import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object()
      .shape({
        product: Yup.string().min(2),
        deliveryman_id: Yup.number().positive(),
        recipient_id: Yup.number().positive(),
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

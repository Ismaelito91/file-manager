const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return res.status(400).json({ message: "Invalid data.", errors });
  }

  req.body = value;
  next();
};

export default validate;

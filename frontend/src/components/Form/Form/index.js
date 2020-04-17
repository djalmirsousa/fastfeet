import React, { useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import LoadingLine from '~/components/LoadingLine';

import { Form } from './styles';

export default function MyForm({
  schema,
  onSubmit,
  loading,
  children,
  ...rest
}) {
  const formRef = useRef(null);

  const handleSubmit = useCallback(
    async data => {
      try {
        if (schema) {
          await schema.validate(data, {
            abortEarly: false,
          });
        }

        await onSubmit(data);
      } catch (err) {
        const validationErrors = {};
        if (err instanceof Yup.ValidationError) {
          err.inner.forEach(error => {
            validationErrors[error.path] = error.message;
          });
          formRef.current.setErrors(validationErrors);
        }
      }
    },
    [onSubmit, schema]
  );

  return (
    <Form ref={formRef} onSubmit={handleSubmit} {...rest}>
      {loading && <LoadingLine />}
      {children}
    </Form>
  );
}

MyForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  schema: PropTypes.instanceOf(Yup.object),
  loading: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array])
    .isRequired,
};

MyForm.defaultProps = {
  schema: null,
  loading: false,
};

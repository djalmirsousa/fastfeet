import React, { useRef, useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useField } from '@unform/core';
import { MdInsertPhoto } from 'react-icons/md';

import { Container, PreviewContainer, Preview, Error } from './styles';

const ImageInput = ({ name, ...rest }) => {
  const inputRef = useRef(null);
  const { fieldName, registerField, defaultValue, error } = useField(name);
  const [preview, setPreview] = useState(defaultValue);
  const handlePreview = useCallback(e => {
    const file = e.target.files[0];
    if (!file) {
      setPreview(null);
    }
    const previewURL = URL.createObjectURL(file);
    setPreview(previewURL);
  }, []);
  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'files[0]',
      clearValue(ref) {
        ref.value = '';
        setPreview(null);
      },
      setValue(_, value) {
        setPreview(value);
      },
    });
  }, [fieldName, registerField]);
  return (
    <Container>
      <label htmlFor={fieldName}>
        <PreviewContainer>
          {preview ? (
            <Preview src={preview} alt="Preview" />
          ) : (
            <div>
              <MdInsertPhoto />
              <span>Adicionar foto</span>
            </div>
          )}
        </PreviewContainer>

        <input
          id={fieldName}
          type="file"
          ref={inputRef}
          onChange={handlePreview}
          accept="image/*"
          {...rest}
        />
        {error && <Error className="error">{error}</Error>}
      </label>
    </Container>
  );
};
export default ImageInput;

ImageInput.propTypes = {
  name: PropTypes.string.isRequired,
};

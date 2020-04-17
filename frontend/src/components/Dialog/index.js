import React, { memo } from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import { Title } from './styles';

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

function MyDialog({ open, children, onClose, title }) {
  return (
    <Dialog
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      open={open}
      onClose={onClose}
    >
      {title && (
        <Title style={{ cursor: 'move' }} id="draggable-dialog-title">
          {title}
        </Title>
      )}
      {children}
    </Dialog>
  );
}

MyDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.element.isRequired,
};

MyDialog.defaultProps = {
  title: null,
};

export default memo(MyDialog);

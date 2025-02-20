import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function YesNoDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Delete"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this entry?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <button onClick={onClose}>No</button>
        <button onClick={() => {
          onConfirm();
          onClose();
        }} autoFocus>
          Yes
        </button>
      </DialogActions>
    </Dialog>
  );
}

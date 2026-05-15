'use client';

import React from 'react';
import { ConfirmDialog } from './confirm-dialog';

type DeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
};

export function DeleteDialog({
  open,
  onOpenChange,
  title = 'Are you absolutely sure?',
  description = 'This action cannot be undone. This will permanently delete the record and remove all associated data from our servers.',
  confirmText = 'Delete',
  isLoading = false,
  onConfirm,
}: DeleteDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      confirmText={confirmText}
      variant="destructive"
      isLoading={isLoading}
      onConfirm={onConfirm}
    />
  );
}

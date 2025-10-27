import { useState, useCallback } from 'react';

/**
 * Return type for the useConfirmDialog hook
 */
interface UseConfirmDialogReturn<T = string> {
  /** The item pending deletion (or null if dialog is closed) */
  itemToDelete: T | null;

  /** Whether the dialog is open */
  isOpen: boolean;

  /** Open the dialog with the item to delete */
  openDialog: (item: T) => void;

  /** Close the dialog without deleting */
  closeDialog: () => void;

  /** Confirm and perform the delete action */
  confirmDelete: () => Promise<void>;

  /** Whether the delete action is in progress */
  isDeleting: boolean;
}

/**
 * Reusable hook for managing confirmation dialogs (especially delete confirmations)
 * Handles open/close state and async delete operations
 *
 * @example
 * ```tsx
 * function AirportListPage() {
 *   const deleteAirportMutation = useDeleteAirport();
 *
 *   const {
 *     itemToDelete,
 *     isOpen,
 *     openDialog,
 *     closeDialog,
 *     confirmDelete,
 *     isDeleting,
 *   } = useConfirmDialog({
 *     onConfirm: async (id: string) => {
 *       await deleteAirportMutation.mutateAsync(id);
 *     },
 *   });
 *
 *   return (
 *     <>
 *       {airports.map(airport => (
 *         <AirportCard
 *           key={airport.id}
 *           airport={airport}
 *           onDelete={() => openDialog(airport.id)}
 *         />
 *       ))}
 *
 *       <DeleteConfirmDialog
 *         open={isOpen}
 *         onOpenChange={closeDialog}
 *         onConfirm={confirmDelete}
 *         isLoading={isDeleting}
 *       />
 *     </>
 *   );
 * }
 * ```
 */
export function useConfirmDialog<T = string>(config: {
  onConfirm: (item: T) => Promise<void>;
}): UseConfirmDialogReturn<T> {
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDialog = useCallback((item: T) => {
    setItemToDelete(item);
  }, []);

  const closeDialog = useCallback(() => {
    setItemToDelete(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      await config.onConfirm(itemToDelete);
      setItemToDelete(null);
    } catch (error) {
      // Error handling is done by the mutation itself (via handleMutationError)
      // Just log for debugging
      if (import.meta.env.DEV) {
        console.error('Delete failed:', error);
      }
    } finally {
      setIsDeleting(false);
    }
  }, [itemToDelete, config]);

  return {
    itemToDelete,
    isOpen: itemToDelete !== null,
    openDialog,
    closeDialog,
    confirmDelete,
    isDeleting,
  };
}

// apps/frontend/src/hooks/useEntityForm.ts

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { handleMutationError } from "@/lib/errors";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";

/**
 * Configuration for the useEntityForm hook
 */
interface UseEntityFormConfig<
  TEntity,
  TCreateInput, // <-- Renamed from TInput
  TUpdateInput, // <-- Added this new generic
  TQueryOptions = unknown,
> {
  /** Entity ID (for edit mode) */
  id?: string;

  /** Query hook to fetch entity data for editing */
  useGetQuery: (
    id: string,
    options?: TQueryOptions
  ) => UseQueryResult<TEntity, Error>;

  /** Query options to pass to the get query */
  queryOptions?: TQueryOptions;

  /** Mutation hook for creating entity */
  useCreateMutation: () => UseMutationResult<
    TEntity,
    Error,
    TCreateInput,
    unknown
  >; // <-- Use TCreateInput

  /** Mutation hook for updating entity */
  useUpdateMutation: () => UseMutationResult<
    TEntity,
    Error,
    { id: string; data: TUpdateInput }, // <-- Use TUpdateInput
    unknown
  >;

  /** Route to navigate to on success */
  successRoute: string;

  /** Entity name for display in messages (e.g., "route", "airport") */
  entityName: string;

  /** Optional: Custom success message for create */
  createSuccessMessage?: string;

  /** Optional: Custom success message for update */
  updateSuccessMessage?: string;
}

/**
 * Return type for the useEntityForm hook
 */
interface UseEntityFormReturn<
  TEntity,
  TFormInput, // <-- This is the type the form component submits
> {
  /** The entity data (only available in edit mode) */
  entity: TEntity | undefined;

  /** Is the entity data loading */
  isLoading: boolean;

  /** Error loading entity data */
  loadError: Error | null;

  /** Is this edit mode (true) or create mode (false) */
  isEdit: boolean;

  /** Form submission handler */
  handleSubmit: (data: TFormInput) => Promise<void>; // <-- Use TFormInput

  /** Is a mutation in progress */
  isSubmitting: boolean;

  /** Navigate to the success route */
  handleCancel: () => void;
}

/**
 * Reusable hook for entity form pages (create/edit)
 * ... (omitting example for brevity)
 */
export function useEntityForm<
  TEntity,
  TCreateInput extends TUpdateInput, // <-- Renamed
  TUpdateInput, // <-- Added
  TQueryOptions = unknown,
>({
  id,
  useGetQuery,
  queryOptions,
  useCreateMutation,
  useUpdateMutation,
  successRoute,
  entityName,
  createSuccessMessage,
  updateSuccessMessage,
}: UseEntityFormConfig<
  TEntity,
  TCreateInput,
  TUpdateInput,
  TQueryOptions
>): UseEntityFormReturn<TEntity, TCreateInput> {
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // Fetch entity data if editing
  const {
    data: entity,
    isLoading,
    error: loadError,
  } = useGetQuery(id || "", {
    ...queryOptions,
    enabled: isEdit,
  } as TQueryOptions); // Cast options to TQueryOptions

  const createMutation = useCreateMutation();
  const updateMutation = useUpdateMutation();

  // The form's `onSubmit` provides TCreateInput
  const handleSubmit = async (data: TCreateInput) => {
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, data });
        toast.success(
          updateSuccessMessage ||
            `${capitalize(entityName)} updated successfully`
        );
      } else {
        await createMutation.mutateAsync(data);
        toast.success(
          createSuccessMessage ||
            `${capitalize(entityName)} created successfully`
        );
      }
      navigate(successRoute);
    } catch (error) {
      const { title, message } = handleMutationError(
        error,
        isEdit ? `update ${entityName}` : `create ${entityName}`
      );
      toast.error(title, { description: message });
    }
  };

  const handleCancel = () => {
    navigate(successRoute);
  };

  return {
    entity,
    isLoading,
    loadError,
    isEdit,
    handleSubmit,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    handleCancel,
  };
}

/**
 * Capitalize first letter of a string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { officeService } from './office.service';
import { OfficeFormValues } from './schemas/office.schema';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export const useOffices = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: ['offices', params],
    queryFn: () => officeService.getAll(params),
  });
};

export const useOffice = (id: string) => {
  return useQuery({
    queryKey: ['offices', id],
    queryFn: () => officeService.getById(id),
    enabled: !!id,
  });
};

export const useCreateOffice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: OfficeFormValues) => officeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offices'] });
      toast.success('Office created successfully');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to create office');
    },
  });
};

export const useUpdateOffice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<OfficeFormValues> }) => officeService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['offices'] });
      queryClient.invalidateQueries({ queryKey: ['offices', variables.id] });
      toast.success('Office updated successfully');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to update office');
    },
  });
};

export const useDeleteOffice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => officeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offices'] });
      toast.success('Office deleted successfully');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to delete office');
    },
  });
};

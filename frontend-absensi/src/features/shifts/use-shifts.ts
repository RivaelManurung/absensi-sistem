import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shiftService } from './shift.service';
import { ShiftFormValues } from './schemas/shift.schema';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export const useShifts = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: ['shifts', params],
    queryFn: () => shiftService.getAll(params),
  });
};

export const useShift = (id: string) => {
  return useQuery({
    queryKey: ['shifts', id],
    queryFn: () => shiftService.getById(id),
    enabled: !!id,
  });
};

export const useCreateShift = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ShiftFormValues) => shiftService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      toast.success('Shift created successfully');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to create shift');
    },
  });
};

export const useUpdateShift = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ShiftFormValues> }) => shiftService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      queryClient.invalidateQueries({ queryKey: ['shifts', variables.id] });
      toast.success('Shift updated successfully');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to update shift');
    },
  });
};

export const useDeleteShift = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => shiftService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      toast.success('Shift deleted successfully');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to delete shift');
    },
  });
};

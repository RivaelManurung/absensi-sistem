import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceService, LocationPayload } from './attendance.service';
import { toast } from 'sonner';

export const useAttendanceToday = () => {
  return useQuery({
    queryKey: ['attendance', 'today'],
    queryFn: () => attendanceService.getToday(),
  });
};

export const useAttendanceHistory = () => {
  return useQuery({
    queryKey: ['attendance', 'history'],
    queryFn: () => attendanceService.getHistory(),
  });
};

export const useCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LocationPayload) => attendanceService.checkIn(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Checked in successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to check in');
    },
  });
};

export const useCheckOut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LocationPayload) => attendanceService.checkOut(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Checked out successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to check out');
    },
  });
};

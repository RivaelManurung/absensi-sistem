import { toast } from 'sonner';

export const toastHelper = {
  success: (title: string, description?: string) => {
    toast.success(title, {
      description,
    });
  },
  error: (title: string, description?: string) => {
    toast.error(title, {
      description,
    });
  },
  info: (title: string, description?: string) => {
    toast(title, {
      description,
    });
  },
  promise: (promise: Promise<any>, { loading, success, error }: { loading: string; success: string | ((data: any) => string); error: string | ((err: any) => string) }) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    });
  },
};

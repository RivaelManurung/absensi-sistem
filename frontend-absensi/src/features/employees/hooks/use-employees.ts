import { useQuery } from "@tanstack/react-query";
import { employeeService } from "../services/employee.service";

export function useEmployees(params?: any) {
  return useQuery({
    queryKey: ["employees", params],
    queryFn: () => employeeService.getAll(params),
  });
}

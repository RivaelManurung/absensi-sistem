import { useQuery } from "@tanstack/react-query";
import { employeeService } from "../services/employee.service";

export function useEmployee(id: string) {
  return useQuery({
    queryKey: ["employees", id],
    queryFn: () => employeeService.getById(id),
    enabled: !!id,
  });
}

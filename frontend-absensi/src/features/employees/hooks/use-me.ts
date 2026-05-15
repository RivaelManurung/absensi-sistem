import { useQuery } from "@tanstack/react-query";
import { employeeService } from "../services/employee.service";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryKeyHashFn: () => "me", // Ensure it's unique
    queryFn: () => employeeService.getMe(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

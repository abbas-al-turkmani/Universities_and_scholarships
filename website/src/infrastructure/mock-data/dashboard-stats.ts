import { getDashboardStats } from "@/application/use-cases/recommend-programs";
import { applications, opportunities, students } from "@/infrastructure/mock-data";

export const dashboardStats = getDashboardStats({
  applications,
  programs: opportunities,
  students,
});

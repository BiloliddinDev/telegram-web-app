import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface AnalyticsData {
  summary: {
    totalInventoryValue: number;
    warehouseStockValue: number;
    sellerStockValue: number;
  };
  sellers: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    telegramId: string;
    totalValue: number;
    productCount: number;
  }[];
}

export const useAnalytics = () => {
  return useQuery<AnalyticsData>({
    queryKey: ["analytics"],
    queryFn: async () => {
      const { data } = await api.get("/analytics");
      return data;
    },
  });
};

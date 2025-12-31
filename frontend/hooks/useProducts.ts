import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Product } from "@/interface/products.type";
import { Category } from "@/interface/category.type";

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get("/products");
      return data.products;
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productData: Partial<Product>) => {
      const { data } = await api.post("/products", productData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/categories");
      return data.categories;
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (categoryData: Partial<Category>) => {
      const { data } = await api.post("/categories", categoryData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

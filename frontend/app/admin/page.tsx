"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/useToast";
import { useProducts } from "@/hooks/useProducts";
import { useSellers, useReports } from "@/hooks/useAdminData";
import { ProductCard } from "@/components/ProductCard";
import { SellerCard } from "@/components/SellerCard";
import { CreateProductDialog } from "@/components/admin/CreateProductDialog";
import { CreateCategoryDialog } from "@/components/admin/CreateCategoryDialog";
import { CreateSellerDialog } from "@/components/admin/CreateSellerDialog";
import { AssignProductDialog } from "@/components/admin/AssignProductDialog";
import { Product } from "@/interface/products.type";
import { User } from "@/interface/User.type";

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { ToastComponent } = useToast();
  
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: sellers = [], isLoading: sellersLoading } = useSellers();
  const { data: reports, isLoading: reportsLoading } = useReports();
  
  const [activeTab, setActiveTab] = useState("products");

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  if (productsLoading || sellersLoading || reportsLoading) {
    return <div className="p-4">Yuklanmoqda...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <ToastComponent />
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">
            Salom, {user?.firstName || user?.username || "Admin"}!
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 h-auto">
            <TabsTrigger value="products">Mahsulotlar</TabsTrigger>
            <TabsTrigger value="sellers">Sotuvchilar</TabsTrigger>
            <TabsTrigger value="reports">Hisobotlar</TabsTrigger>
            <TabsTrigger value="assign">Biriktirish</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle>Mahsulotlar</CardTitle>
                    <CardDescription>
                      Barcha mahsulotlarni boshqaring
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <CreateCategoryDialog />
                    <CreateProductDialog />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product: Product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sellers" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Sotuvchilar</CardTitle>
                    <CardDescription>
                      Barcha sotuvchilarni boshqaring
                    </CardDescription>
                  </div>
                  <CreateSellerDialog />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {sellers.map((seller: User) => (
                    <SellerCard key={seller._id} seller={seller} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Oylik Hisobot</CardTitle>
                <CardDescription>Oylik savdo statistikasi</CardDescription>
              </CardHeader>
              <CardContent>
                {reports && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Jami savdo</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-2xl font-bold">{reports.summary.totalSales} ta</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-green-500/5 border-green-500/20">
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Jami daromad</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-2xl font-bold text-green-600">
                            {reports.summary.totalRevenue.toLocaleString()} so&apos;m
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-blue-500/5 border-blue-500/20">
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Sotilgan mahsulotlar</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-2xl font-bold text-blue-600">{reports.summary.totalQuantity} ta</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-orange-500/5 border-orange-500/20">
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Jami mahsulotlar</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-2xl font-bold text-orange-600">{products.length} ta</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assign" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Mahsulotni sotuvchiga biriktirish</CardTitle>
                <CardDescription>
                  Mahsulot va sotuvchini tanlang
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product: Product) => (
                    <ProductCard 
                      key={product._id} 
                      product={product} 
                      footer={<AssignProductDialog product={product} />}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

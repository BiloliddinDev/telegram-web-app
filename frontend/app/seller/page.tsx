/* eslint-disable react/no-unescaped-entities */
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/useToast";
import { useSellerProducts, useSellerSales, useSellerReports } from "@/hooks/useSellerData";
import { ProductCard } from "@/components/ProductCard";
import { CreateSaleDialog } from "@/components/seller/CreateSaleDialog";
import { Product } from "@/interface/products.type";
import { Sale } from "@/interface/sale.type";

export default function SellerPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { ToastComponent } = useToast();
  
  const { data: products = [], isLoading: productsLoading } = useSellerProducts();
  const { data: sales = [], isLoading: salesLoading } = useSellerSales();
  const { data: reports, isLoading: reportsLoading } = useSellerReports();
  
  const [activeTab, setActiveTab] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (user && user.role !== "seller") {
      router.push("/");
    }
  }, [user, router]);

  if (productsLoading || salesLoading || reportsLoading) {
    return <div className="p-4">Yuklanmoqda...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <ToastComponent />
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Sotuvchi Panel</h1>
          <p className="text-muted-foreground">
            Salom, {user?.firstName || user?.username || "Sotuvchi"}!
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Mahsulotlar</TabsTrigger>
            <TabsTrigger value="sales">Sotuvlar</TabsTrigger>
            <TabsTrigger value="reports">Hisobotlar</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Mahsulotlar</CardTitle>
                <CardDescription>
                  Sizga biriktirilgan mahsulotlar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input 
                    placeholder="Mahsulotni qidirish..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.length === 0 ? (
                    <p className="text-muted-foreground col-span-full text-center py-4">
                      Mahsulot topilmadi
                    </p>
                  ) : (
                    filteredProducts.map((product: Product) => (
                      <ProductCard 
                        key={product._id} 
                        product={product} 
                        footer={<CreateSaleDialog product={product} />}
                      />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Sotuvlar</CardTitle>
                <CardDescription>Barcha sotuvlar ro&apos;yxati</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {sales.length === 0 ? (
                    <p className="text-muted-foreground col-span-full text-center py-8">Hali sotuvlar yo&apos;q</p>
                  ) : (
                    sales.map((sale: Sale) => (
                      <Card key={sale._id}>
                        <CardContent className="p-4 pt-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {sale.product?.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {sale.quantity} ta x {sale.price.toLocaleString()} so&apos;m
                              </p>
                              <p className="text-md font-bold text-primary mt-1">
                                Jami: {sale.totalPrice.toLocaleString()} so&apos;m
                              </p>
                              {sale.customerName && (
                                <div className="mt-2 text-sm border-t pt-2">
                                  <p><span className="text-muted-foreground">Mijoz:</span> {sale.customerName}</p>
                                  {sale.customerPhone && <p><span className="text-muted-foreground">Tel:</span> {sale.customerPhone}</p>}
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] bg-secondary px-2 py-1 rounded">
                                {new Date(sale.createdAt).toLocaleDateString("uz-UZ")}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Oylik Statistikangiz</CardTitle>
                <CardDescription>Shaxsiy savdo ko&apos;rsatkichlari</CardDescription>
              </CardHeader>
              <CardContent>
                {reports && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Sotuvlar soni</CardTitle>
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
                          <CardTitle className="text-sm font-medium text-muted-foreground">Mahsulotlar</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-2xl font-bold text-blue-600">{reports.summary.totalQuantity} ta</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

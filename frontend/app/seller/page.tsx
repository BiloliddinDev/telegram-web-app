/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { AxiosError } from "axios";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  assignedSellers: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Sale {
  _id: string;
  product: Product;
  quantity: number;
  price: number;
  totalPrice: number;
  customerName?: string;
  customerPhone?: string;
  createdAt: string;
}

interface Report {
  summary: {
    totalSales: number;
    totalRevenue: number;
    totalQuantity: number;
  };
  salesByCategory: Record<string, number>;
  recentSales: Sale[];
}

export default function SellerPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { showToast, ToastComponent } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [reports, setReports] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");
  const [isSaleModalOpen, setIsSaleModalOpen] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [productsRes, salesRes, reportsRes] = await Promise.all([
        api.get("/seller/products"),
        api.get("/seller/sales"),
        api.get("/seller/reports"),
      ]);
      setProducts(productsRes.data.products);
      setSales(salesRes.data.sales);
      setReports(reportsRes.data);
    } catch (error: unknown) {
      console.error("Error loading data:", error);
      const axiosError = error as AxiosError;
      showToast(
        (axiosError.response?.data as { error?: string })?.error ||
          "Ma'lumotlarni yuklashda xatolik",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (user && user.role !== "seller") {
      router.push("/");
    }
    if (user?.role === "seller") {
      loadData();
    }
  }, [user, router, loadData]);

  const handleCreateSale = async (
    e: React.FormEvent<HTMLFormElement>,
    productId: string
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const product = products.find((p) => p._id === productId);
      if (!product) {
        showToast("Mahsulot topilmadi", "error");
        return;
      }
      await api.post("/sales", {
        productId,
        quantity: parseInt(formData.get("quantity") as string),
        price: product.price,
        customerName: formData.get("customerName"),
        customerPhone: formData.get("customerPhone"),
        notes: formData.get("notes"),
      });
      showToast("Sotuv muvaffaqiyatli qayd etildi", "success");
      setIsSaleModalOpen(null);
      loadData();
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      showToast(
        (axiosError.response?.data as { error?: string })?.error ||
          "Sotuv qayd etishda xatolik",
        "error"
      );
    }
  };

  if (loading) {
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
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {products.length === 0 ? (
                    <p className="text-muted-foreground">
                      Sizga hali mahsulot biriktirilmagan
                    </p>
                  ) : (
                    products.map((product) => (
                      <Card key={product._id} className="overflow-hidden">
                        <CardHeader className="p-4">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                            <span className="text-xs bg-secondary px-2 py-1 rounded">
                              {product.category}
                            </span>
                          </div>
                          <CardDescription className="line-clamp-2">
                            {product.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-2xl font-bold mb-1">
                            {product.price.toLocaleString()} so&apos;m
                          </p>
                          <p className="text-sm text-muted-foreground mb-4">
                            Omborda: {product.stock} ta
                          </p>
                          <Dialog 
                            open={isSaleModalOpen === product._id} 
                            onOpenChange={(open) => setIsSaleModalOpen(open ? product._id : null)}
                          >
                            <DialogTrigger asChild>
                              <Button className="w-full" disabled={product.stock <= 0}>
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                {product.stock <= 0 ? "Tugagan" : "Sotish"}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                              <form
                                onSubmit={(e) =>
                                  handleCreateSale(e, product._id)
                                }
                              >
                                <DialogHeader>
                                  <DialogTitle>Sotish</DialogTitle>
                                  <DialogDescription>
                                    {product.name} - {product.price.toLocaleString()} so&apos;m
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="quantity">Miqdor</Label>
                                    <Input
                                      id="quantity"
                                      name="quantity"
                                      type="number"
                                      min="1"
                                      max={product.stock}
                                      defaultValue="1"
                                      required
                                    />
                                    <p className="text-xs text-muted-foreground">Mavjud: {product.stock} ta</p>
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="customerName">
                                      Mijoz ismi
                                    </Label>
                                    <Input
                                      id="customerName"
                                      name="customerName"
                                      placeholder="Ismi"
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="customerPhone">
                                      Mijoz telefoni
                                    </Label>
                                    <Input
                                      id="customerPhone"
                                      name="customerPhone"
                                      placeholder="+998"
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="notes">Izoh</Label>
                                    <Input id="notes" name="notes" placeholder="Qoshimcha ma'lumot" />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button type="submit" className="w-full">Sotish</Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </CardContent>
                      </Card>
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
                    sales.map((sale) => (
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

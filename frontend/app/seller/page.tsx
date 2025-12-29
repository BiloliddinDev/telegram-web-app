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
  totalPrice: number;
  customerName?: string;
  customerPhone?: string;
  createdAt: string;
}

interface Report {
  totalSales: number;
  totalRevenue: number;
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
      showToast(
        (error as any)?.response?.data?.error || "Ma'lumotlarni yuklashda xatolik",
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
      await api.post("/sales", {
        productId,
        quantity: parseInt(formData.get("quantity") as string),
        price: product.price,
        customerName: formData.get("customerName"),
        customerPhone: formData.get("customerPhone"),
        notes: formData.get("notes"),
      });
      showToast("Sotuv muvaffaqiyatli qayd etildi", "success");
      loadData();
      (document.getElementById(`sale-dialog-${productId}`) as any)?.close();
    } catch (error: any) {
      showToast(
        error.response?.data?.error || "Sotuv qayd etishda xatolik",
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
                <CardTitle>Biriktirilgan Mahsulotlar</CardTitle>
                <CardDescription>
                  Sizga biriktirilgan mahsulotlar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {products.length === 0 ? (
                    <p className="text-muted-foreground">
                      Sizga hali mahsulot biriktirilmagan
                    </p>
                  ) : (
                    products.map((product) => (
                      <Card key={product._id}>
                        <CardHeader>
                          <CardTitle>{product.name}</CardTitle>
                          <CardDescription>
                            {product.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold mb-2">
                            {product.price} so'm
                          </p>
                          <p className="text-sm text-muted-foreground mb-4">
                            Omborda: {product.stock}
                          </p>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="w-full">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Sotish
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <form
                                onSubmit={(e) =>
                                  handleCreateSale(e, product._id)
                                }
                              >
                                <DialogHeader>
                                  <DialogTitle>Sotish</DialogTitle>
                                  <DialogDescription>
                                    {product.name} - {product.price} so'm
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
                                      required
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="customerName">
                                      Mijoz ismi
                                    </Label>
                                    <Input
                                      id="customerName"
                                      name="customerName"
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="customerPhone">
                                      Mijoz telefoni
                                    </Label>
                                    <Input
                                      id="customerPhone"
                                      name="customerPhone"
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="notes">Izoh</Label>
                                    <Input id="notes" name="notes" />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button type="submit">Sotish</Button>
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
                <CardDescription>Barcha sotuvlar ro'yxati</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sales.length === 0 ? (
                    <p className="text-muted-foreground">Hali sotuvlar yo'q</p>
                  ) : (
                    sales.map((sale) => (
                      <Card key={sale._id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">
                                {sale.product?.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Miqdor: {sale.quantity} | Narx: {sale.price}{" "}
                                so'm
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Jami: {sale.totalAmount} so'm
                              </p>
                              {sale.customerName && (
                                <p className="text-sm">
                                  Mijoz: {sale.customerName}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
                                {new Date(sale.saleDate).toLocaleDateString(
                                  "uz-UZ"
                                )}
                              </p>
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
                <CardTitle>Hisobotlar</CardTitle>
                <CardDescription>Oylik savdo statistikasi</CardDescription>
              </CardHeader>
              <CardContent>
                {reports && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Jami savdo</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">
                            {reports.summary.totalSales}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Jami daromad
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">
                            {reports.summary.totalRevenue.toLocaleString()} so'm
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Jami miqdor</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">
                            {reports.summary.totalQuantity}
                          </p>
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

"use client";

import { useEffect, useState } from "react";
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
import { Plus, Package, Users, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/useToast";

export default function AdminPage() {
  const router = useRouter();
  const { user, fetchUser } = useAuthStore();
  const { showToast, ToastComponent } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [reports, setReports] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/");
    }
    if (user?.role === "admin") {
      loadData();
    }
  }, [user, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, sellersRes, reportsRes] = await Promise.all([
        api.get("/products"),
        api.get("/admin/sellers"),
        api.get("/admin/reports/monthly"),
      ]);
      setProducts(productsRes.data.products);
      setSellers(sellersRes.data.sellers);
      setReports(reportsRes.data);
    } catch (error: any) {
      console.error("Error loading data:", error);
      showToast(
        error.response?.data?.error || "Ma'lumotlarni yuklashda xatolik",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await api.post("/products", {
        name: formData.get("name"),
        description: formData.get("description"),
        price: parseFloat(formData.get("price") as string),
        category: formData.get("category"),
        stock: parseInt(formData.get("stock") as string),
      });
      showToast("Mahsulot muvaffaqiyatli qo'shildi", "success");
      loadData();
      (document.getElementById("product-dialog") as any)?.close();
    } catch (error: any) {
      console.error("Error creating product:", error);
      showToast(
        error.response?.data?.error || "Mahsulot qo'shishda xatolik",
        "error"
      );
    }
  };

  const handleAssignProduct = async (productId: string, sellerId: string) => {
    try {
      await api.post(`/admin/sellers/${sellerId}/products/${productId}`);
      showToast("Mahsulot muvaffaqiyatli biriktirildi", "success");
      loadData();
    } catch (error: any) {
      console.error("Error assigning product:", error);
      showToast(
        error.response?.data?.error || "Mahsulot biriktirishda xatolik",
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
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">
            Salom, {user?.firstName || user?.username || "Admin"}!
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Mahsulotlar</TabsTrigger>
            <TabsTrigger value="sellers">Sotuvchilar</TabsTrigger>
            <TabsTrigger value="reports">Hisobotlar</TabsTrigger>
            <TabsTrigger value="assign">Biriktirish</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Mahsulotlar</CardTitle>
                    <CardDescription>
                      Barcha mahsulotlarni boshqaring
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Yangi mahsulot
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <form onSubmit={handleCreateProduct}>
                        <DialogHeader>
                          <DialogTitle>Yangi mahsulot qo'shish</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Nomi</Label>
                            <Input id="name" name="name" required />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="description">Tavsif</Label>
                            <Input id="description" name="description" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="price">Narxi</Label>
                            <Input
                              id="price"
                              name="price"
                              type="number"
                              step="0.01"
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="category">Kategoriya</Label>
                            <Input id="category" name="category" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="stock">Ombordagi miqdor</Label>
                            <Input
                              id="stock"
                              name="stock"
                              type="number"
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Qo'shish</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <Card key={product._id}>
                      <CardHeader>
                        <CardTitle>{product.name}</CardTitle>
                        <CardDescription>{product.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">
                          {product.price} so'm
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Omborda: {product.stock}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sellers" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Sotuvchilar</CardTitle>
                <CardDescription>
                  Barcha sotuvchilarni ko'ring va boshqaring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sellers.map((seller) => (
                    <Card key={seller._id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">
                              {seller.firstName} {seller.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              @{seller.username}
                            </p>
                            <p className="text-sm">
                              Biriktirilgan mahsulotlar:{" "}
                              {seller.assignedProducts?.length || 0}
                            </p>
                          </div>
                          <div>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                seller.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {seller.isActive ? "Faol" : "Nofaol"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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

          <TabsContent value="assign" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Mahsulotni sotuvchiga biriktirish</CardTitle>
                <CardDescription>
                  Mahsulot va sotuvchini tanlang
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <Card key={product._id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {product.price} so'm
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {sellers.map((seller) => (
                              <Button
                                key={seller._id}
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleAssignProduct(product._id, seller._id)
                                }
                                disabled={product.assignedSellers?.some(
                                  (s: any) => s._id === seller._id
                                )}
                              >
                                {seller.firstName}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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


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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
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

interface User {
  _id: string;
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role: "admin" | "seller";
  isActive: boolean;
  assignedProducts?: Product[];
}

interface Category {
  _id: string;
  name: string;
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
    totalProducts: number;
    totalUsers: number;
    totalQuantity: number;
  };
  salesByCategory: Record<string, number>;
  topProducts: Product[];
  recentSales: Sale[];
}

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { showToast, ToastComponent } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  console.log(loading, "loading");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [productsRes, sellersRes, reportsRes, categoriesRes] = await Promise.all([
        api.get("/products"),
        api.get("/admin/sellers"),
        api.get("/admin/reports/monthly"),
        api.get("/categories"),
      ]);
      setProducts(productsRes.data.products);
      setSellers(sellersRes.data.sellers);
      setReports(reportsRes.data);
      setCategories(categoriesRes.data.categories);
    } catch (error: unknown) {
      console.error("Error loading data:", error);
      const axiosError = error as AxiosError;
      showToast(
        (axiosError.response?.data as { error?: string })?.error ||
          "Ma&apos;lumotlarni yuklashda xatolik",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/");
    }
    if (user?.role === "admin") {
      loadData();
    }
  }, [user, router, loadData]);

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
      setIsProductModalOpen(false);
      loadData();
    } catch (error: unknown) {
      console.error("Error creating product:", error);
      const axiosError = error as AxiosError;
      showToast(
        (axiosError.response?.data as { error?: string })?.error ||
          "Mahsulot qo'shishda xatolik",
        "error"
      );
    }
  };

  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await api.post("/categories", {
        name: formData.get("name"),
      });
      showToast("Kategoriya muvaffaqiyatli qo'shildi", "success");
      setIsCategoryModalOpen(false);
      loadData();
    } catch (error: unknown) {
      console.error("Error creating category:", error);
      const axiosError = error as AxiosError;
      showToast(
        (axiosError.response?.data as { error?: string })?.error ||
          "Kategoriya qo'shishda xatolik",
        "error"
      );
    }
  };

  const handleCreateSeller = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await api.post("/admin/sellers", {
        telegramId: formData.get("telegramId"),
        username: formData.get("username"),
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        phoneNumber: formData.get("phoneNumber"),
      });
      showToast("Sotuvchi muvaffaqiyatli qo'shildi", "success");
      setIsSellerModalOpen(false);
      loadData();
    } catch (error: unknown) {
      console.error("Error creating seller:", error);
      const axiosError = error as AxiosError;
      showToast(
        (axiosError.response?.data as { error?: string })?.error ||
          "Sotuvchi qo'shishda xatolik",
        "error"
      );
    }
  };

  const handleAssignProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProduct) return;
    const formData = new FormData(e.currentTarget);
    const sellerId = formData.get("sellerId") as string;
    const quantity = formData.get("quantity") as string;
    try {
      await api.post(`/admin/sellers/${sellerId}/products/${selectedProduct._id}`, {
        quantity: parseInt(quantity)
      });
      showToast("Mahsulot muvaffaqiyatli biriktirildi", "success");
      setIsAssignModalOpen(false);
      loadData();
    } catch (error: unknown) {
      console.error("Error assigning product:", error);
      const axiosError = error as AxiosError;
      showToast(
        (axiosError.response?.data as { error?: string })?.error ||
          "Mahsulot biriktirishda xatolik",
        "error"
      );
    }
  };
  //
  // if (loading) {
  //   return <div className="p-4">Yuklanmoqda...</div>;
  // }

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
                    <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1">
                          <Plus className="mr-2 h-4 w-4" />
                          Kategoriya
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleCreateCategory}>
                          <DialogHeader>
                            <DialogTitle>Yangi kategoriya qo&apos;shish</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="cat-name">Nomi</Label>
                              <Input id="cat-name" name="name" required />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Qo&apos;shish</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
                      <DialogTrigger asChild>
                        <Button className="flex-1">
                          <Plus className="mr-2 h-4 w-4" />
                          Mahsulot
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
                        <form onSubmit={handleCreateProduct}>
                          <DialogHeader>
                            <DialogTitle>Yangi mahsulot qo&apos;shish</DialogTitle>
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
                              <select 
                                id="category" 
                                name="category" 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {categories.map(cat => (
                                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                                ))}
                                {categories.length === 0 && <option value="general">Umumiy</option>}
                              </select>
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
                            <Button type="submit">Qo&apos;shish</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <Card key={product._id} className="overflow-hidden">
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                            <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                          </div>
                          <span className="text-xs bg-secondary px-2 py-1 rounded">
                            {product.category}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-xl font-bold">
                          {product.price.toLocaleString()} so&apos;m
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
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Sotuvchilar</CardTitle>
                    <CardDescription>
                      Barcha sotuvchilarni boshqaring
                    </CardDescription>
                  </div>
                  <Dialog open={isSellerModalOpen} onOpenChange={setIsSellerModalOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Yangi sotuvchi
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
                      <form onSubmit={handleCreateSeller}>
                        <DialogHeader>
                          <DialogTitle>Yangi sotuvchi qo&apos;shish</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="telegramId">Telegram ID (ixtiyoriy)</Label>
                            <Input id="telegramId" name="telegramId" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" name="username" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="firstName">Ism</Label>
                            <Input id="firstName" name="firstName" required />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="lastName">Familiya</Label>
                            <Input id="lastName" name="lastName" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="phoneNumber">Telefon raqam</Label>
                            <Input id="phoneNumber" name="phoneNumber" placeholder="+998901234567" required />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Qo&apos;shish</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {sellers.map((seller) => (
                    <Card key={seller._id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {seller.firstName} {seller.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              @{seller.username || "username yo'q"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {seller.phoneNumber || "tel yo'q"}
                            </p>
                            <p className="text-sm mt-2">
                              Mahsulotlar: {seller.assignedProducts?.length || 0} ta
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
                  {products.map((product) => (
                    <Card key={product._id}>
                      <CardContent className="pt-6">
                        <div className="flex flex-col gap-4">
                          <div>
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Omborda: {product.stock}
                            </p>
                            <p className="text-sm font-bold mt-1">
                              {product.price.toLocaleString()} so&apos;m
                            </p>
                          </div>
                          
                          <Dialog 
                            open={isAssignModalOpen && selectedProduct?._id === product._id} 
                            onOpenChange={(open) => {
                              setIsAssignModalOpen(open);
                              if(open) setSelectedProduct(product);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="w-full">
                                Biriktirish
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <form onSubmit={handleAssignProduct}>
                                <DialogHeader>
                                  <DialogTitle>Mahsulotni biriktirish</DialogTitle>
                                  <CardDescription>{product.name}</CardDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="sellerId">Sotuvchi</Label>
                                    <select 
                                      id="sellerId" 
                                      name="sellerId" 
                                      required
                                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      <option value="">Tanlang...</option>
                                      {sellers.map(seller => (
                                        <option key={seller._id} value={seller._id}>
                                          {seller.firstName} {seller.lastName} (@{seller.username})
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="quantity">Miqdor (Ombordan olinadi)</Label>
                                    <Input
                                      id="quantity"
                                      name="quantity"
                                      type="number"
                                      min="1"
                                      max={product.stock}
                                      required
                                    />
                                    <p className="text-xs text-muted-foreground">Max: {product.stock}</p>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button type="submit">Biriktirish</Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
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

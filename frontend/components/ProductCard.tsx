import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
  footer?: React.ReactNode;
}

export function ProductCard({ product, footer }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
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
        {footer && <div className="mt-4">{footer}</div>}
      </CardContent>
    </Card>
  );
}

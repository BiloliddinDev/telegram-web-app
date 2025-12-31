import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/interface/User.type";

export function SellerCard({ seller }: { seller: User }) {
  return (
    <Card>
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
  );
}

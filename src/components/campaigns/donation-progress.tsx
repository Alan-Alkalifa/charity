import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import type { DonationMode } from "@/types";

interface Props {
  donationMode: DonationMode;
  currentAmount: number;
  goalAmount: number;
  moneyProgress: number;
  currentItemQty: number;
  goalItemQty: number;
  itemProgress: number;
}

export function DonationProgress({
  donationMode,
  currentAmount,
  goalAmount,
  moneyProgress,
  currentItemQty,
  goalItemQty,
  itemProgress,
}: Props) {
  return (
    <div className="space-y-4">
      {(donationMode === "money" || donationMode === "both") && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-primary">{formatCurrency(currentAmount)}</span>
            <span className="text-muted-foreground">dari {formatCurrency(goalAmount)}</span>
          </div>
          <Progress value={moneyProgress} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">{moneyProgress}% tercapai</p>
        </div>
      )}

      {(donationMode === "item" || donationMode === "both") && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-primary">{currentItemQty} barang</span>
            <span className="text-muted-foreground">dari {goalItemQty} barang</span>
          </div>
          <Progress value={itemProgress} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">{itemProgress}% terpenuhi</p>
        </div>
      )}
    </div>
  );
}

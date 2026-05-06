"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";

interface Props {
  campaignId: string;
  initialMoneyAmount: number;
  initialItemQty: number;
  goalAmount: number;
  goalItemQty: number;
  donationMode: "money" | "item" | "both";
}

export function RealtimeProgress({
  campaignId,
  initialMoneyAmount,
  initialItemQty,
  goalAmount,
  goalItemQty,
  donationMode,
}: Props) {
  const [moneyAmount] = useState(initialMoneyAmount);
  const [itemQty] = useState(initialItemQty);

  const moneyProgress = goalAmount > 0 ? Math.round((moneyAmount / goalAmount) * 100) : 0;
  const itemProgress = goalItemQty > 0 ? Math.round((itemQty / goalItemQty) * 100) : 0;

  if (donationMode === "money") {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{formatCurrency(moneyAmount)}</span>
          <span className="text-sm text-muted-foreground">{Math.min(moneyProgress, 100)}%</span>
        </div>
        <Progress value={Math.min(moneyProgress, 100)} />
        <p className="text-xs text-muted-foreground">Target: {formatCurrency(goalAmount)}</p>
      </div>
    );
  }

  if (donationMode === "item") {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{itemQty} terkumpul</span>
          <span className="text-sm text-muted-foreground">{Math.min(itemProgress, 100)}%</span>
        </div>
        <Progress value={Math.min(itemProgress, 100)} />
        <p className="text-xs text-muted-foreground">Target: {goalItemQty} item</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Donasi Uang</h3>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{formatCurrency(moneyAmount)}</span>
          <span className="text-sm text-muted-foreground">{Math.min(moneyProgress, 100)}%</span>
        </div>
        <Progress value={Math.min(moneyProgress, 100)} />
        <p className="text-xs text-muted-foreground">Target: {formatCurrency(goalAmount)}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Barang</h3>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{itemQty} terkumpul</span>
          <span className="text-sm text-muted-foreground">{Math.min(itemProgress, 100)}%</span>
        </div>
        <Progress value={Math.min(itemProgress, 100)} />
        <p className="text-xs text-muted-foreground">Target: {goalItemQty} item</p>
      </div>
    </div>
  );
}

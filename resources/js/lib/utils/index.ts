export { cn } from "./cn";

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  let d: Date;
  if (typeof date === "string") {
    const [year, month, day] = date.split("T")[0].split("-").map(Number);
    d = new Date(year, month - 1, day);
  } else {
    d = date;
  }
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatCurrency(amount: number, currency: string = "PHP"): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
  }).format(amount);
}

export function abbreviateNumber(value: number): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absValue >= 1_000_000_000) {
    return sign + (absValue / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (absValue >= 1_000_000) {
    return sign + (absValue / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (absValue >= 1_000) {
    return sign + (absValue / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return sign + absValue.toString();
}

export function formatCurrencyCompact(amount: number, currency: string = "PHP"): string {
  const symbol = currency === "PHP" ? "₱" : "$";
  return symbol + abbreviateNumber(amount);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function generateInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

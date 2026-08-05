const moneyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatMoney(value: number): string {
  return moneyFormatter.format(value);
}

export function formatMoneyExact(value: number): string {
  const f = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
  return f.format(value);
}

export interface MoneyParts {
  whole: string;
  frac: string;
}

export function formatMoneyParts(value: number): MoneyParts {
  const [whole, frac] = value.toFixed(2).split(".");
  return { whole: Number(whole).toLocaleString("en-IN"), frac };
}

export function formatPercent(value: number): string {
  return `${value.toFixed(0)}%`;
}

export function greeting(name?: string): string {
  const hour = new Date().getHours();
  let period = "Hello";
  if (hour >= 5 && hour < 12) period = "Good morning";
  else if (hour >= 12 && hour < 17) period = "Good afternoon";
  else if (hour >= 17 && hour < 22) period = "Good evening";
  else period = "Good night";
  return name ? `${period}, ${name.split(" ")[0]}` : period;
}

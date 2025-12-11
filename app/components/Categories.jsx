import {
  DrawerContent,
  DrawerTrigger,
  Drawer,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  UtensilsCrossed,
  ShoppingCart,
  Car,
  Home,
  Plug,
  HeartPulse,
  BookOpen,
  Plane,
  ShoppingBag,
  PiggyBank,
  Receipt,
  ChartBarStacked,
} from "lucide-react";

export const expenseCategories = [
  { name: "Food & Dining", icon: UtensilsCrossed },
  { name: "Groceries", icon: ShoppingCart },
  { name: "Transportation", icon: Car },
  { name: "Housing & Utilities", icon: Home },
  { name: "Bills & Services", icon: Plug },
  { name: "Health & Medical", icon: HeartPulse },
  { name: "Education", icon: BookOpen },
  { name: "Travel", icon: Plane },
  { name: "Shopping", icon: ShoppingBag },
  { name: "Savings & Investments", icon: PiggyBank },
  { name: "Taxes", icon: Receipt },
  { name: "Other", icon: ChartBarStacked },
];

export function Categories({ children, setCategory }) {
  return (
    <Drawer
      className="p-2"
      onOpenChange={(open) => {
        if (open) {
        } else {
        }
      }}
    >
      <DrawerTrigger asChild className="">
        {children}
      </DrawerTrigger>
      <DrawerContent className={"p-5"}>
        <div className="grid grid-cols-2 mt-5 sm:grid-cols-3 gap-4">
          {expenseCategories.map(({ name, icon: Icon }) => (
            <DrawerClose>
              <div
                onClick={() => {
                  setCategory(name);
                }}
                key={name}
                className="flex rounded-full truncate items-center gap-3 p-3 border hover:bg-secondary/50 transition items"
              >
                <Icon className="w-5 h-5 text-primary" strokeWidth={1} />
                <span className="text-sm truncate font-medium subLabel2">
                  {name}
                </span>
              </div>
            </DrawerClose>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

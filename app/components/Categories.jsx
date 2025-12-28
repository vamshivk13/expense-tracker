import { Button } from "@/components/ui/button";
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
  Plus,
  ArrowRight,
  AlignHorizontalJustifyCenter,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  ref,
  onValue,
  db,
  update,
  query,
  orderByChild,
  startAt,
  endAt,
} from "../firebaseConfig";
import { get } from "firebase/database";

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
  const [currentCategory, setCurrentCategory] = useState("");
  const [categories, setCategories] = useState([]);

  //Load Categories
  useEffect(() => {
    const myRef = ref(db, "/categories");
    get(myRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log("Categories", snapshot.val().categories);
          setCategories(snapshot.val()?.categories); // This is your value
        } else {
          console.log("No data available");
          setCategories([]);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function handleUpdateCategories() {
    console.log("CATEGROEIS UPDATE CALL");
    const myRef = ref(db, "/categories");
    const updatedCategories = [
      ...categories,
      { name: currentCategory, icon: null },
    ];
    setCategories((prev) => [...prev, { name: currentCategory, icon: null }]);
    update(myRef, { categories: [...updatedCategories] }).catch((err) =>
      console.log("Error saving category to db", err)
    );
    setCurrentCategory("");
  }

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
      <DrawerContent className={"p-5 "}>
        <div className="flex mt-5 mb-3 gap-2 sm:w-1/4 w-full items-center cursor-pointer select-none subLabel2 bg-secondary/70 ml-auto border border-(--border-color) px-3 py-1 rounded-full">
          <div className="flex flex-col w-full gap-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateCategories();
              }}
              className="flex gap-2 items-center cursor-pointer"
              id="category"
            >
              <input
                placeHolder="add category"
                type="text"
                className={
                  "text-sm p-1 mainLabel2 w-full resize-none min-h-2 border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                }
                value={currentCategory}
                onChange={(e) => setCurrentCategory(e.target.value)}
              />
              <Button variant={"outline"} className={"h-8 w-8 rounded-full"}>
                <ArrowRight />
              </Button>
            </form>
          </div>
        </div>
        <div className="grid grid-cols-2 mt-5 sm:grid-cols-3 gap-4 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {[...expenseCategories, ...categories].map(({ name, icon: Icon }) => (
            <DrawerClose>
              <div
                onClick={() => {
                  setCategory(name);
                }}
                key={name}
                className="flex rounded-full truncate items-center gap-3 p-3 border hover:bg-secondary/50 transition items"
              >
                {Icon == null ? (
                  <AlignHorizontalJustifyCenter
                    className="w-5 h-5 text-primary"
                    strokeWidth={1}
                  />
                ) : (
                  <Icon className="w-5 h-5 text-primary" strokeWidth={1} />
                )}
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

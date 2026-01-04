import { ChartBarStacked, ChevronRight, Utensils } from "lucide-react";
import {
  getFormattedAmount,
  getFormattedDate,
  getFormattedDateShort,
} from "../../util/DateUtility";
import React, { useEffect, useState } from "react";
import { expenseCategories } from "../Categories";
import { Separator } from "@/components/ui/separator";

export default function Transactions({ expense }) {
  const [Icon, setCategoryIcon] = React.useState(null);
  const [iconColor, setIconColor] = React.useState(null);

  const categoryIcons = expenseCategories;
  const [category, setCategory] = useState(expense.category || "Other");

  useEffect(() => {
    setCategory(expense.category);
  }, [expense]);

  React.useEffect(() => {
    // Update category icon based on selected category
    if (category) {
      const foundCategory = categoryIcons.find((cat) => cat.name === category);
      if (foundCategory) {
        setCategoryIcon(foundCategory.icon);
        setIconColor(foundCategory.color);
      } else {
        const otherCategory = categoryIcons.find((cat) => cat.name === "Other");
        setCategoryIcon(otherCategory.icon);
        setIconColor(otherCategory.color);
      }
    }
  }, [category]);

  return (
    <div key={expense.date} className="py-2 rounded-xl cursor-pointer mb-2">
      <div className="grid gap-x-3 grid-cols-8 items-center">
        <div className=" col-span-6">
          <div className="flex items-center gap-4">
            <div
              style={{ borderColor: iconColor }}
              className="flex-shrink-0 border border-(--border-color) p-2 rounded-full text-[var(--color)] dark:text-[var(--dark-color)]"
            >
              {Icon && <Icon strokeWidth={1} />}
            </div>
            <div className="flex flex-col truncate gap-2">
              <div className="truncate mainLabel2 font-semibold tracking-normal">
                {expense.description}
              </div>
              <div className="text-sm bg-muted mr-auto px-3 py-1 rounded-full lowercase text-gray-700 dark:text-gray-400 belowLabel">
                {expense.category}
              </div>
            </div>
          </div>
        </div>
        {/* <div className="hidden sm:block text-center mainHeading3 text-gray-700 dark:text-gray-400">
          {getFormattedDate(expense.date)}
        </div> */}
        <div className="flex col-span-2 place-items-center mx-auto items-center gap-1">
          <div className="flex flex-col text-center gap-2">
            <div className="block customLabel text-(--foreground)">
              {getFormattedAmount(expense.amount)}
            </div>
            <div className="text-sm block belowLabel text-gray-700 dark:text-gray-400">
              {getFormattedDateShort(expense.date)}
            </div>
          </div>
          <ChevronRight
            strokeWidth={1}
            size={16}
            className="self-start text-foreground"
          />
        </div>
        <Separator className="mt-4 col-span-full w-full" />
      </div>
    </div>
  );
}

import { ChartBarStacked, ChevronRight, Utensils } from "lucide-react";
import {
  getFormattedAmount,
  getFormattedDate,
  getFormattedDateShort,
} from "../../util/DateUtility";
import { stringToDarkHSL, stringToHSL } from "@/app/util/ColorUtility";

export default function Transactions({ expense }) {
  const lightColor = stringToHSL(expense.description);
  const darkColor = stringToDarkHSL(expense.description);

  return (
    <div key={expense.date} className="py-2 rounded-xl cursor-pointer mb-2">
      <div className="grid gap-x-3 grid-cols-7 items-center">
        <div className=" col-span-5 sm:col-span-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 bg-background border border-(--border-color)/60 p-2 rounded-full text-[var(--color)] dark:text-[var(--dark-color)]">
              <ChartBarStacked strokeWidth={1} />
            </div>
            <div className="flex flex-col truncate gap-1">
              <div className="truncate mainLabel2 font-semibold tracking-normal">
                {expense.description}
              </div>
              <div className="text-sm lowercase text-gray-700 dark:text-gray-400 belowLabel">
                {expense.category}
              </div>
            </div>
          </div>
        </div>
        <div className="hidden sm:block text-center mainHeading3 text-gray-700 dark:text-gray-400">
          {getFormattedDate(expense.date)}
        </div>
        <div className="flex col-span-2 sm:col-span-2place-items-center mx-auto items-center gap-1">
          <div className="flex flex-col text-center gap-1">
            <div className="sm:block hidden customLabel">
              {getFormattedAmount(expense.amount)}
            </div>
            <div className="sm:hidden block customLabel text-(--foreground)">
              {getFormattedAmount(expense.amount)}
            </div>
            <div className="text-sm block belowLabel sm:hidden text-gray-700 dark:text-gray-400">
              {getFormattedDateShort(expense.date)}
            </div>
          </div>
          <ChevronRight
            strokeWidth={1}
            size={16}
            className="self-start text-foreground"
          />
        </div>
      </div>
    </div>
  );
}

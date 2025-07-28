import { Utensils } from "lucide-react";
import { getFormattedAmount, getFormattedDate } from "../../util/DateUtility";
import { stringToDarkHSL, stringToHSL } from "@/app/util/ColorUtility";

export default function Transactions({ expense }) {
  const lightColor = stringToHSL(expense.description);
  const darkColor = stringToDarkHSL(expense.description);

  return (
    <div key={expense.date} className="p-2 rounded-xl cursor-pointer mb-2">
      <div className="grid gap-x-3 grid-cols-4 items-center">
        <div className=" col-span-3 sm:col-span-2">
          <div className="flex items-center gap-4">
            <div
              className="flex-shrink-0 bg-(--color-muted) p-2 rounded-full text-[var(--color)] dark:text-[var(--dark-color)]"
              style={{
                "--color": lightColor,
                "--dark-color": darkColor,
              }}
            >
              <Utensils />
            </div>
            <div className="flex flex-col truncate">
              <div className="truncate">{expense.description}</div>
              <div className="text-sm text-gray-700 dark:text-gray-400">
                {expense.category}
              </div>
            </div>
          </div>
        </div>
        <div className="hidden sm:block text-center text-gray-700 dark:text-gray-400">
          {getFormattedDate(expense.date)}
        </div>
        <div className="flex flex-col text-center">
          <div className="text-red-500">
            {getFormattedAmount(expense.amount)}
          </div>
          <div className="text-sm block sm:hidden text-gray-700 dark:text-gray-400">
            {getFormattedDate(expense.date)}
          </div>
        </div>
      </div>
    </div>
  );
}

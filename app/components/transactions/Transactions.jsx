import { Utensils } from "lucide-react";
import { getFormattedAmount, getFormattedDate } from "../../util/DateUtility";

export default function Transactions({ expense }) {
  return (
    <div
      key={expense.date}
      className="p-2 rounded-xl cursor-pointer hover:bg-muted/70 dark:hover:bg-muted/70 mb-1"
    >
      <div className="grid gap-x-3 grid-cols-4 ">
        <div className=" col-span-3 sm:col-span-2">
          <div className="flex items-center gap-4">
            <Utensils className="flex-shrink-0" />
            <div className="flex flex-col truncate">
              <div className="truncate">{expense.description}</div>
              <div className="text-sm text-gray-700 dark:text-gray-400">
                {expense.category}
              </div>
            </div>
          </div>
        </div>
        <div className="hidden sm:block text-center">
          {getFormattedDate(expense.date)}
        </div>
        <div className="flex flex-col text-center">
          <div>{getFormattedAmount(expense.amount)}</div>
          <div className="text-sm block sm:hidden text-gray-700 dark:text-gray-400">
            {getFormattedDate(expense.date)}
          </div>
        </div>
      </div>
    </div>
  );
}

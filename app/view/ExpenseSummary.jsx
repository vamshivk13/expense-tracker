import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Badge,
  Calendar,
  Fingerprint,
  Lightbulb,
  LucideTrendingUp,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { ExpenseSummaryChart } from "../components/ExpenseSummaryChart";
import { useEffect, useState } from "react";
import { ExpenseSummaryBarChart } from "../components/ExpenseSummaryBarChart";
import { getFormattedAmount, getFormattedDate } from "../util/DateUtility";
import fetchInsights from "../insights/fetchInsights";
import { set, get } from "firebase/database";
import { db, ref } from "../firebaseConfig";

const isToday = (date) => {
  const now = new Date();
  return date.toDateString() === now.toDateString();
};

const isCurrentWeek = (date) => {
  const weekStartsOn = 1;
  var now = new Date();
  var start = new Date(now);
  start.setHours(0, 0, 0, 0);
  var day = start.getDay();
  var diff = (day + 7 - weekStartsOn) % 7;

  start.setDate(start.getDate() - diff);

  var end = new Date(start);

  end.setDate(start.getDate() + 6);

  end.setHours(23, 59, 59, 999);

  const nowDate = new Date();
  const firstOfMonth = new Date(nowDate.getFullYear(), nowDate.getMonth(), 1);
  if (start < firstOfMonth) {
    start.setTime(firstOfMonth.getTime());
  }
  const lastOfMonth = new Date(
    nowDate.getFullYear(),
    nowDate.getMonth() + 1,
    0
  );

  // If end spills into next month, clamp it
  if (end > lastOfMonth) {
    end.setTime(lastOfMonth.getTime());
  }

  return date >= start && date <= end;
};

const isCurrentMonth = (date) => {
  const now = new Date();
  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

function getTransactionInsights(transactions) {
  const now = new Date();

  const buckets = {
    today: [],
    week: [],
    month: [],
  };

  // 1️⃣ Split transactions into buckets
  transactions.forEach((tx) => {
    const txDate = new Date(tx.date);

    if (isToday(txDate)) buckets.today.push(tx);
    if (isCurrentWeek(txDate)) buckets.week.push(tx);
    if (isCurrentMonth(txDate)) buckets.month.push(tx);
  });

  // 2️⃣ Local helper inside the same function
  const buildInsight = (label, list) => {
    if (list.length === 0) {
      return `No transactions recorded ${label}.`;
    }

    let total = 0;
    const categoryMap = {};
    const tagMap = {};

    list.forEach((tx) => {
      total += tx.amount;

      categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;

      tx.tags?.forEach((tag) => {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      });
    });

    const topCategory = Object.entries(categoryMap).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0];

    const topTag = Object.entries(tagMap).sort((a, b) => b[1] - a[1])[0]?.[0];

    let message = `You spent ₹${total} ${label}.`;

    if (topCategory) {
      message += ` Most of it was on ${topCategory}.`;
    }

    if (topTag) {
      message += ` Common expense: ${topTag.toLowerCase()}.`;
    }

    return message;
    ``;
  };

  // 3️⃣ Final insights
  return {
    today: buildInsight("today", buckets.today),
    week: buildInsight("this week", buckets.week),
    month: buildInsight("this month", buckets.month),
  };
}

const ExpenseSummary = ({ goBack, transactions: allTransactions }) => {
  const [transactions, setTransactions] = useState(null);
  const [todaysExpense, setTodaysExpense] = useState(0);
  const [weeksExpense, setWeeksExpense] = useState(0);
  const [currentWeeksExpenses, setCurrentWeeksExpenses] = useState([]);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [week, setWeek] = useState("");
  const [isCurrentMonth, setIsCurrentMonth] = useState(false);
  const [insightMessages, setInsightMessages] = useState({
    today: "",
    week: "",
    month: "",
  });

  const [insights, setInsights] = useState({
    summaryOfSpending: "",
    suggestion: [],
    spendingPlanForNextWeek: [],
    transactionPatterns: [],
    transactionsCausingHighestSpend: [],
  });
  const [activeTab, setActiveTab] = useState("week");

  useEffect(() => {
    if (transactions && transactions.length != 0) {
      const month = new Date(transactions[0].date).getMonth();
      const curMonth = new Date().getMonth();
      setIsCurrentMonth(month == curMonth);
    }
  }, [transactions]);

  function getCurrentWeekExpenseTotal(
    allTransactions,
    weekStartsOn /* 0=Sunday, 1=Monday */
  ) {
    weekStartsOn = weekStartsOn === 0 || weekStartsOn === 1 ? weekStartsOn : 1;
    var now = new Date();
    var start = new Date(now);
    start.setHours(0, 0, 0, 0);
    var day = start.getDay();
    var diff = (day + 7 - weekStartsOn) % 7;

    start.setDate(start.getDate() - diff);

    var end = new Date(start);

    end.setDate(start.getDate() + 6);

    end.setHours(23, 59, 59, 999);

    const nowDate = new Date();
    const firstOfMonth = new Date(nowDate.getFullYear(), nowDate.getMonth(), 1);
    if (start < firstOfMonth) {
      start.setTime(firstOfMonth.getTime());
    }
    const lastOfMonth = new Date(
      nowDate.getFullYear(),
      nowDate.getMonth() + 1,
      0
    );

    // If end spills into next month, clamp it
    if (end > lastOfMonth) {
      end.setTime(lastOfMonth.getTime());
    }

    const week =
      start.toLocaleString("default", { month: "short" }) +
      " " +
      String(start.getDate()).padStart(2, "0") +
      "-" +
      String(end.getDate()).padStart(2, "0");
    setWeek(week);
    const total = (allTransactions || []).filter(function (tx) {
      var dt = new Date(tx && tx.date);
      return !isNaN(dt.getTime()) && dt >= start && dt <= end;
    });

    const totalAmount = total.reduce(function (sum, tx) {
      var amt = Number((tx && tx.amount) || 0);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);

    return { totalAmount, expenses: total };
  }

  useEffect(() => {
    setTransactions(allTransactions);
    // Calculate todays expense
    const today = new Date();
    const todayString = today.toLocaleString();
    const total = allTransactions
      .filter(
        (tx) =>
          new Date(tx.date).toLocaleString().split(",")[0] ==
          todayString.split(",")[0]
      )
      .reduce((sum, tx) => sum + tx.amount, 0);

    setTodaysExpense(total);
    // Calculate this week's expense
    const weeksExpense = getCurrentWeekExpenseTotal(allTransactions, 1);
    setWeeksExpense(weeksExpense.totalAmount);

    const transactionsByDate = weeksExpense.expenses.reduce(
      (acc, transaction) => {
        let date = new Date(transaction.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        date = date.split(" ")[0] + " " + date.split(" ")[1].padStart(2, "0");
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
      },
      {}
    );

    const groupedTransactions = [];
    for (const date in transactionsByDate) {
      groupedTransactions.push({
        key: date,
        transactions: transactionsByDate[date],
        totalAmount: transactionsByDate[date].reduce(
          (acc, curr) => acc + curr.amount,
          0
        ),
      });
    }
    setCurrentWeeksExpenses(groupedTransactions);

    // Calculate this month's expense
    const monthlyExpenses = allTransactions.reduce(
      (sum, tx) => sum + tx.amount,
      0
    );
    setMonthlyExpense(monthlyExpenses);
  }, [allTransactions]);
  console.log("curWeek", currentWeeksExpenses);

  useEffect(() => {
    if (!transactions) return;
    setInsightMessages(getTransactionInsights(transactions));
  }, [transactions]);

  useEffect(() => {
    if (!transactions) return;
    // Get Insights from firebase
    if (
      insights?.savedAt == null ||
      new Date(insights?.savedAt) < new Date(Date.now() - 2 * 60 * 60 * 1000)
    )
      console.log("FETCHING INSIGHTS");
    get(ref(db, "/insights"))
      .then((snapshot) => {
        console.log("INSIGHTS GET", snapshot.val());
        const data = snapshot.val()?.insights;
        if (data) {
          console.log("FETCHED INSIGHTS FROM DB", data);
          if (
            data.savedAt &&
            new Date(data.savedAt) > new Date(Date.now() - 2 * 60 * 60 * 1000)
          ) {
            console.log("USING CACHED NOT FETCHING");
            setInsights(data);
          } else {
            console.log("FETCHING NEW INSIGHTS");
            fetchAndStoreInsights();
          }
        } else {
          fetchAndStoreInsights();
        }
      })
      .catch((error) => {
        console.error("Error fetching insights from database: ", error);
      });
    function fetchAndStoreInsights() {
      console.log("INSIDE FETCH AND STORE");
      fetchInsights
        .fetch(transactions)
        .then((data) => {
          setInsights({ ...data, savedAt: Date.now() });
          data = data;
          set(ref(db, "/insights"), {
            insights: { ...data, savedAt: Date.now() },
          }).catch((error) => {
            console.error("Error writing insights to database: ", error);
          });
        })
        .catch((error) => {
          console.error("Error fetching insights: ", error);
          get(ref(db, "/insights")).then((snapshot) => {
            const data = snapshot.val()?.insights;
            console.log("GET INSIGHTS AFTER ERROR", data);
            if (data) {
              setInsights({ ...data, savedAt: Date.now() });
            }
          });
        });
      //save to firebase
    }
  }, [transactions]);

  console.log("INSIGHTS STATE", insights);

  return (
    <div
      className={
        "flex flex-col h-dvh gap-5 sm:container mx-auto px-6 sm:px-16 lg:px-16 py-3"
      }
    >
      <div className="flex flex-col h-full gap-4 text-lg bg-background pt-4 w-full">
        <div className="flex gap-2 col-span-3 items-center relative">
          <ArrowLeft
            className="absolute left-2 top-[50%] translate-y-[-50%]"
            onClick={() => goBack()}
          />
          <div className="mx-auto subLabel px-4 py-2 rounded-full border-[0.3px] border-blue-400">
            Expenses Summary
          </div>
        </div>

        <div className="overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col gap-4">
          {isCurrentMonth && (
            <Tabs
              defaultValue={"week"}
              value={activeTab}
              onValueChange={setActiveTab}
              className={"mt-5 rounded-md"}
            >
              <TabsList className={"flex justify-center w-full"}>
                <TabsTrigger value="today" className={"subLabel2"}>
                  Today
                </TabsTrigger>
                <TabsTrigger className={"subLabel2"} value="week">
                  This Week
                </TabsTrigger>
                <TabsTrigger className={"subLabel2"} value="month">
                  This Month
                </TabsTrigger>
              </TabsList>
              <TabsContent value="today">
                <Card className="@container/card">
                  <CardHeader>
                    <CardDescription>Today's Expenses</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                      ₹{todaysExpense}
                    </CardTitle>
                  </CardHeader>
                  <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 subLabel2 font-medium">
                      {getFormattedDate(new Date())}
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="week">
                <Card className="@container/card">
                  <CardHeader>
                    <CardDescription>This Week's Expenses</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                      ₹{weeksExpense}
                    </CardTitle>
                  </CardHeader>
                  <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="subLabel2 line-clamp-1 flex gap-2 font-medium">
                      {week}
                    </div>
                    <div className="flex w-full gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      {currentWeeksExpenses?.map((expense) => {
                        return (
                          <div
                            key={expense.key}
                            className="flex flex-col gap-2 border select-none items-center justify-center bg-foreground text-background border-(--border-color) rounded-xl px-2 py-2 subLabel2"
                          >
                            <div className="text-muted-foreground text-nowrap">
                              {expense.key}
                            </div>
                            <div className="mainLabel2 py-1 tabular-nums font-semibold">
                              {getFormattedAmount(expense.totalAmount)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="month">
                <Card className="@container/card">
                  <CardHeader>
                    <CardDescription>This Month's Expenses</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                      ₹{monthlyExpense}
                    </CardTitle>
                  </CardHeader>
                  <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium subLabel2">
                      {new Date().toLocaleString("default", { month: "long" }) +
                        ", " +
                        new Date().getFullYear()}
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          )}
          {!isCurrentMonth && (
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>This Month's Expenses</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  ₹{monthlyExpense}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium subLabel2">
                  {new Date().toLocaleString("default", { month: "long" }) +
                    ", " +
                    new Date().getFullYear()}
                </div>
              </CardFooter>
            </Card>
          )}
          <div className="flex gap-4 rounded-2xl border border-gray-100 dark:border-gray-700 px-2 py-3 items-center">
            <div class="flex items-center ml-2 gap-2">
              <Sparkles class="text-blue-500 text-lg" />
            </div>
            <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              {insightMessages[activeTab]}
            </p>
          </div>
          <div className="flex gap-7 mt-3 flex-col">
            <ExpenseSummaryChart transactions={allTransactions} />
            <ExpenseSummaryBarChart transactions={allTransactions} />
            <div>
              <div className="mt-2 flex flex-col gap-2">
                <div class="flex items-center gap-2 mb-1">
                  <WandSparkles
                    size={18}
                    strokeWidth={1}
                    class="text-blue-600 dark:text-blue-400"
                  />
                  <span class="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                    Summary of Spending
                  </span>
                </div>
                <p className="rounded-md py-2 px-2 bg-gray-100 text-sm text-gray-500 dark:text-gray-400">
                  {insights?.summaryOfSpending}
                </p>
                <div className="mt-2 flex flex-col gap-2">
                  <div class="flex items-center gap-2 mb-1">
                    <Lightbulb
                      size={18}
                      strokeWidth={1}
                      class="text-green-600 dark:text-green-400"
                    />
                    <span class="text-xs font-bold text-green-800 dark:text-green-300 uppercase tracking-wide">
                      Quick Tip
                    </span>
                  </div>
                  <div class="flex flex-col gap-1 text-xs text-green-700 dark:text-green-200/80 leading-relaxed">
                    {insights?.suggestion?.map((suggestion) => (
                      <li
                        className="rounded-md py-2 px-2 bg-gray-100"
                        key={suggestion}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </div>
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div class="flex items-center gap-2 mb-1">
                    <Calendar
                      size={18}
                      strokeWidth={1}
                      class="text-blue-600 dark:text-blue-400"
                    />
                    <span class="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wide">
                      Spending Plan For Next Week
                    </span>
                  </div>
                  <div class="flex flex-col gap-1 text-xs text-blue-700 dark:text-blue-200/80 leading-relaxed">
                    {insights?.spendingPlanForNextWeek.map((plan) => (
                      <li
                        className="rounded-md py-2 px-2 bg-gray-100"
                        key={plan}
                      >
                        {plan}
                      </li>
                    ))}
                  </div>
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div class="flex items-center gap-2 mb-1">
                    <Fingerprint
                      size={18}
                      strokeWidth={1}
                      class="text-orange-600 dark:text-orange-400"
                    />
                    <span class="text-xs font-bold text-orange-800 dark:text-orange-300 uppercase tracking-wide">
                      Transaction Patterns
                    </span>
                  </div>
                  <div class="flex flex-col gap-1 text-xs text-orange-700 dark:text-orange-200/80 leading-relaxed">
                    {insights?.transactionPatterns.map((pattern) => (
                      <li
                        className="rounded-md py-2 px-2 bg-gray-100"
                        key={pattern}
                      >
                        {pattern}
                      </li>
                    ))}
                  </div>
                </div>
                {/* <div className="mt-2 flex flex-col gap-2">
                  <div class="flex items-center gap-2 mb-1">
                    <LucideTrendingUp
                      size={18}
                      strokeWidth={1}
                      class="text-red-400 dark:text-red-400"
                    />
                    <span class="text-xs font-bold text-red-600 dark:text-red-300 uppercase tracking-wide">
                      Transactions Causing Highest Spend
                    </span>
                  </div>
                  <div className="flex gap-1 flex-wrap text-xs text-red-500 dark:text-red-200/80">
                    {insights?.transactionsCausingHighestSpend.map((tx) => (
                      <li
                        className="border bg-red-800 dark:bg-red-200 text-background  border-(--border-color) rounded-full px-2 py-1 subLabel2 cursor-pointer"
                        key={tx}
                      >
                        {tx}
                      </li>
                    ))}
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExpenseSummary;

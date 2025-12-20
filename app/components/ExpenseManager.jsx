"use client";

import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Check,
  Plus,
  Receipt,
  UtilityPole,
  UtilityPoleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFormattedAmount } from "../util/DateUtility";
import { Separator } from "@/components/ui/separator";

export function ExpenseManager({ goBack }) {
  return (
    <div
      className={
        "flex flex-col h-dvh gap-5 sm:container mx-auto px-6 sm:px-16 lg:px-16 py-3"
      }
    >
      <div className="flex flex-col h-full gap-4 text-lg bg-background py-4 w-full">
        <div className="flex gap-2 col-span-3 items-center ">
          <ArrowLeft className=" " onClick={() => goBack()} />
          <div className="mx-auto subLabel px-4 py-2 rounded-full border-[0.3px] border-blue-400">
            Expenses Manager
          </div>
          <Button className={"p-1 rounded-full"}>
            <Plus />
            <p className="subLabel2">add bill</p>
          </Button>
        </div>
        <div className="overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex mb-1 flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="mainLabel2 col-span-6">{"December 20"}</div>
                <div className="font-medium col-span-2 subLabel place-self-center text-(--foreground)/90">
                  {getFormattedAmount(2340)}
                </div>
              </div>
            </div>
            <Card
              className={
                "rounded-sm px-3 py-3 shadow-[0_px_1px_rgb(0,0,0,0.2)]"
              }
            >
              <CardContent className={"p-0"}>
                <div className="grid grid-cols-5 items-center">
                  <div className="col-span-4 flex place-self-start items-center gap-4">
                    <div className="bg-background border border-(--border-color)/60 p-2 rounded-full text-[var(--color)] dark:text-[var(--dark-color)]">
                      <Receipt />
                    </div>
                    <div className="mr-auto flex gap-1 flex-col">
                      <div className="subLabel2">Power Bill</div>
                      <div className="col-span-1 subLabel">₹350</div>
                      <div className="subLabel3 !text-green-700">Upcoming</div>
                    </div>
                  </div>

                  <Button
                    className={
                      "rounded-full col-span-1 subLabel2 place-self-center"
                    }
                  >
                    Paid <Check strokeWidth={1} />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card
              className={
                "rounded-sm px-3 py-3 shadow-[0_px_1px_rgb(0,0,0,0.2)]"
              }
            >
              <CardContent className={"p-0"}>
                <div className="grid grid-cols-5 items-center">
                  <div className="col-span-4 flex place-self-start items-center gap-4">
                    <div className="bg-background border border-(--border-color)/60 p-2 rounded-full text-[var(--color)] dark:text-[var(--dark-color)]">
                      <Receipt />
                    </div>
                    <div className="mr-auto flex gap-1 flex-col">
                      <div className="subLabel2">Power Bill</div>
                      <div className="col-span-1 subLabel">₹350</div>
                      <div className="subLabel3 !text-green-700">Upcoming</div>
                    </div>
                  </div>

                  <Button
                    className={
                      "rounded-full col-span-1 subLabel2 place-self-center"
                    }
                  >
                    Paid <Check strokeWidth={1} />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card
              className={
                "rounded-sm px-3 py-3 shadow-[0_px_1px_rgb(0,0,0,0.2)]"
              }
            >
              <CardContent className={"p-0"}>
                <div className="grid grid-cols-5 items-center">
                  <div className="col-span-4 flex place-self-start items-center gap-4">
                    <div className="bg-background border border-(--border-color)/60 p-2 rounded-full text-[var(--color)] dark:text-[var(--dark-color)]">
                      <Receipt />
                    </div>
                    <div className="mr-auto flex gap-1 flex-col">
                      <div className="subLabel2">Power Bill</div>
                      <div className="col-span-1 subLabel">₹350</div>
                      <div className="subLabel3 !text-green-700">Upcoming</div>
                    </div>
                  </div>

                  <Button
                    className={
                      "rounded-full col-span-1 subLabel2 place-self-center"
                    }
                  >
                    Paid <Check strokeWidth={1} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex mb-1 flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="mainLabel2 col-span-6">{"December 20"}</div>
                <div className="font-medium col-span-2 subLabel place-self-center text-(--foreground)/90">
                  {getFormattedAmount(2340)}
                </div>
              </div>
            </div>
            <Card
              className={
                "rounded-sm px-3 py-3 shadow-[0_px_1px_rgb(0,0,0,0.2)]"
              }
            >
              <CardContent className={"p-0"}>
                <div className="grid grid-cols-5 items-center">
                  <div className="col-span-4 flex place-self-start items-center gap-4">
                    <div className="bg-background border border-(--border-color)/60 p-2 rounded-full text-[var(--color)] dark:text-[var(--dark-color)]">
                      <Receipt />
                    </div>
                    <div className="mr-auto flex gap-1 flex-col">
                      <div className="subLabel2">Power Bill</div>
                      <div className="col-span-1 subLabel">₹350</div>
                      <div className="subLabel3 !text-green-700">Upcoming</div>
                    </div>
                  </div>

                  <Button
                    className={
                      "rounded-full col-span-1 subLabel2 place-self-center"
                    }
                  >
                    Paid <Check strokeWidth={1} />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card
              className={
                "rounded-sm px-3 py-3 shadow-[0_px_1px_rgb(0,0,0,0.2)]"
              }
            >
              <CardContent className={"p-0"}>
                <div className="grid grid-cols-5 items-center">
                  <div className="col-span-4 flex place-self-start items-center gap-4">
                    <div className="bg-background border border-(--border-color)/60 p-2 rounded-full text-[var(--color)] dark:text-[var(--dark-color)]">
                      <Receipt />
                    </div>
                    <div className="mr-auto flex gap-1 flex-col">
                      <div className="subLabel2">Power Bill</div>
                      <div className="col-span-1 subLabel">₹350</div>
                      <div className="subLabel3 !text-green-700">Upcoming</div>
                    </div>
                  </div>

                  <Button
                    className={
                      "rounded-full col-span-1 subLabel2 place-self-center"
                    }
                  >
                    Paid <Check strokeWidth={1} />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card
              className={
                "rounded-sm px-3 py-3 shadow-[0_px_1px_rgb(0,0,0,0.2)]"
              }
            >
              <CardContent className={"p-0"}>
                <div className="grid grid-cols-5 items-center">
                  <div className="col-span-4 flex place-self-start items-center gap-4">
                    <div className="bg-background border border-(--border-color)/60 p-2 rounded-full text-[var(--color)] dark:text-[var(--dark-color)]">
                      <Receipt />
                    </div>
                    <div className="mr-auto flex gap-1 flex-col">
                      <div className="subLabel2">Power Bill</div>
                      <div className="col-span-1 subLabel">₹350</div>
                      <div className="subLabel3 !text-green-700">Upcoming</div>
                    </div>
                  </div>

                  <Button
                    className={
                      "rounded-full col-span-1 subLabel2 place-self-center"
                    }
                  >
                    Paid <Check strokeWidth={1} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex mb-1 flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="mainLabel2 col-span-6">{"December 20"}</div>
                <div className="font-medium col-span-2 subLabel place-self-center text-(--foreground)/90">
                  {getFormattedAmount(2340)}
                </div>
              </div>
            </div>
            <Card
              className={
                "rounded-sm px-3 py-3 shadow-[0_px_1px_rgb(0,0,0,0.2)]"
              }
            >
              <CardContent className={"p-0"}>
                <div className="grid grid-cols-5 items-center">
                  <div className="col-span-4 flex place-self-start items-center gap-4">
                    <div className="bg-background border border-(--border-color)/60 p-2 rounded-full text-[var(--color)] dark:text-[var(--dark-color)]">
                      <Receipt />
                    </div>
                    <div className="mr-auto flex gap-1 flex-col">
                      <div className="subLabel2">Power Bill</div>
                      <div className="col-span-1 subLabel">₹350</div>
                      <div className="subLabel3 !text-green-700">Upcoming</div>
                    </div>
                  </div>

                  <Button
                    className={
                      "rounded-full col-span-1 subLabel2 place-self-center"
                    }
                  >
                    Paid <Check strokeWidth={1} />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card
              className={
                "rounded-sm px-3 py-3 shadow-[0_px_1px_rgb(0,0,0,0.2)]"
              }
            >
              <CardContent className={"p-0"}>
                <div className="grid grid-cols-5 items-center">
                  <div className="col-span-4 flex place-self-start items-center gap-4">
                    <div className="bg-background border border-(--border-color)/60 p-2 rounded-full text-[var(--color)] dark:text-[var(--dark-color)]">
                      <Receipt />
                    </div>
                    <div className="mr-auto flex gap-1 flex-col">
                      <div className="subLabel2">Power Bill</div>
                      <div className="col-span-1 subLabel">₹350</div>
                      <div className="subLabel3 !text-green-700">Upcoming</div>
                    </div>
                  </div>

                  <Button
                    className={
                      "rounded-full col-span-1 subLabel2 place-self-center"
                    }
                  >
                    Paid <Check strokeWidth={1} />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card
              className={
                "rounded-sm px-3 py-3 shadow-[0_px_1px_rgb(0,0,0,0.2)]"
              }
            >
              <CardContent className={"p-0"}>
                <div className="grid grid-cols-5 items-center">
                  <div className="col-span-4 flex place-self-start items-center gap-4">
                    <div className="bg-background border border-(--border-color)/60 p-2 rounded-full text-[var(--color)] dark:text-[var(--dark-color)]">
                      <Receipt />
                    </div>
                    <div className="mr-auto flex gap-1 flex-col">
                      <div className="subLabel2">Power Bill</div>
                      <div className="col-span-1 subLabel">₹350</div>
                      <div className="subLabel3 !text-green-700">Upcoming</div>
                    </div>
                  </div>

                  <Button
                    className={
                      "rounded-full col-span-1 subLabel2 place-self-center"
                    }
                  >
                    Paid <Check strokeWidth={1} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

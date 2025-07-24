"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { IndianRupee } from "lucide-react";
import { Shapes } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { Notebook } from "lucide-react";
import { Tag } from "lucide-react";

export default function Page() {
  const expenseTags = [
    { id: "food", tag: "Food", category: "Living" },
    { id: "transport", tag: "Transport", category: "Travel" },
    { id: "rent", tag: "Rent", category: "Housing" },
    { id: "utilities", tag: "Utilities", category: "Housing" },
    { id: "shopping", tag: "Shopping", category: "Personal" },
    { id: "health", tag: "Health", category: "Medical" },
    { id: "education", tag: "Education", category: "Learning" },
    { id: "subscriptions", tag: "Subscriptions", category: "Recurring" },
    { id: "entertainment", tag: "Entertainment", category: "Leisure" },
    { id: "others", tag: "Others", category: "Miscellaneous" },
  ];
  return (
    <div
      className={
        "h-[calc(100lvh-50px)] bg-red-500 flex flex-col gap-3 py-3 px-4"
      }
    >
      <Card className="flex-3/4 bg--(background) border-none">
        <CardHeader>
          <CardTitle>Add Expense</CardTitle>
        </CardHeader>
        <CardContent className={"flex flex-col gap-4"}>
          <div className="grid w-full gap-1">
            <div className="flex flex-col gap-1">
              <Label
                className="text-sm text-gray-700 dark:text-gray-400"
                htmlFor="amount"
              >
                Amount
              </Label>
              <div className="flex items-center">
                <IndianRupee className={"h-5"} />
                <Input
                  className={
                    "text-lg border-none dark:bg-(--background) bg-(--background) focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                  }
                  type="number"
                  id="amount"
                  placeHolder="0"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full gap-1">
            <Label
              className="text-sm text-gray-700 dark:text-gray-400"
              htmlFor="amount"
            >
              Category
            </Label>
            <div
              className="flex gap-2 items-center cursor-pointer"
              id="category"
            >
              <Shapes className={"h-5"} />
              <div className="text-lg">Others</div>
              <ChevronRight className="h-5 ml-auto" />
            </div>
          </div>
          {/* Description */}
          <div className="flex flex-col w-full gap-1">
            <Label
              className="text-sm text-gray-700 dark:text-gray-400"
              htmlFor="amount"
            >
              Description
            </Label>
            <div
              className="flex gap-2 items-center cursor-pointer"
              id="category"
            >
              <Notebook className={"h-5"} />
              <Textarea
                placeHolder="write a description"
                className={
                  "text-sm dark:bg-(--background) bg-(--background) resize-none min-h-2 border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                }
              />
            </div>

            {/* tags */}
            <div className="flex flex-col w-full gap-1">
              <Label
                className="text-sm text-gray-700 dark:text-gray-400"
                htmlFor="amount"
              >
                Tags
              </Label>
              <div
                className="flex gap-2 items-center cursor-pointer"
                id="category"
              >
                <Tag className={"h-5"} />
                <Input
                  placeHolder="add tags"
                  type="text"
                  className={
                    "text-sm dark:bg-(--background) bg-(--background) resize-none min-h-2 border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                  }
                />
              </div>
              <div className="flex gap-1 flex-wrap">
                {expenseTags.map((tag) => {
                  return (
                    <Badge className={"cursor-pointer"} key={tag.id}>
                      {tag.tag}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex-1/4 flex items-center">
        <Button
          className={
            "ml-auto rounded-full bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-300"
          }
          size={"icon"}
          onClick={() => {
            router.push("/add");
          }}
        >
          <Plus></Plus>
        </Button>
      </div>
    </div>
  );
}

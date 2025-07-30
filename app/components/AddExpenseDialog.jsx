import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import AddExpense from "./AddExpense";

export default function AddExpenseDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="hidden sm:rounded-xl sm:flex col-span-2 cursor-pointer rounded-full sm:blockrounded-full dark:bg-blue-300/70 bg-blue-300/80 p-2 items-center gap-2 justify-around">
          <div className="p-2 rounded-full bg-(--color-muted)/10">
            <Plus />
          </div>
          <div>Add Expense</div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[70%] dark:bg-(--gray-dialog)/100 h-[80%] z-50">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>
        <div>
          <AddExpense />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
      {/* </form> */}
    </Dialog>
  );
}

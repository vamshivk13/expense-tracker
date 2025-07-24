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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import AddExpense from "./AddExpense";

export default function AddExpenseDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={
            "rounded-full bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-300"
          }
          size={"icon"}
        >
          <Plus></Plus>
        </Button>
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

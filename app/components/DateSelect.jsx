import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DateSelect = () => {
  const months = [
    { value: 0, name: "Jan" },
    { value: 1, name: "Feb" },
    { value: 2, name: "Mar" },
    { value: 3, name: "Apr" },
    { value: 4, name: "May" },
    { value: 5, name: "Jun" },
    { value: 6, name: "Jul" },
    { value: 7, name: "Aug" },
    { value: 8, name: "Sep" },
    { value: 9, name: "Oct" },
    { value: 10, name: "Nov" },
    { value: 11, name: "Dec" },
  ];
  return (
    <div className=" ml-auto">
      <Select onValueChange={(value) => console.log(value)}>
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="June" />
        </SelectTrigger>
        <SelectContent className={"text-base"}>
          {months.map((month) => (
            <SelectItem value={month.value}>{month.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DateSelect;

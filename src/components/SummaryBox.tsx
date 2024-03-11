/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";

const SummaryBox = ({
  value,
  label,
  circleColor,
  textLabelColor,
  icon
}: {
  value: number;
  label: string;
  circleColor?: string;
  textLabelColor?: string;
  icon?:any
}) => {
  return (
    <div
      className="h-40 bg-white border-2 border-[#B28A4C] rounded-lg 
      shadow-[16px_16px_20px_0px_rgba(178,138,76,0.2)] p-4 flex flex-col justify-between gap-2"
    >
      <div className="flex justify-between items-center">
        <div className={cn("rounded-full w-12 h-12 bg-black ", circleColor )}>
          <div className="flex p-1 w-12 h-12">
          {icon}
          </div>
        </div>
        <div
          className={cn("text-[#666666] text-5xl font-bold", textLabelColor)}
        >
          {value.toLocaleString()}
        </div>
      </div>
      <div>
        <div className="text-[#666666] font-medium text-2xl truncate">
          {label}
        </div>
      </div>
    </div>
  );
};

export default SummaryBox;

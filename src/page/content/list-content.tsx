import { fetcher } from "@/api";
import { BeaconData, BeaconResponse } from "@/types/message";
import { ColumnDef } from "@tanstack/react-table";
import useSWR from "swr";
import { DataTable } from "../data-table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const columns: ColumnDef<BeaconData>[] = [
  {
    accessorKey: "campaign_name",
    header: "ชื่อแคมเปญ",
  },
  {
    // accessorFn: (row) => row.message_config.status,
    accessorKey: "message_config.status",
    header: () => (
      <div className="text-center">
        <h1>สถานะแคมเปญ</h1>
      </div>
    ),

    cell(props) {
      return (
        <div className="flex justify-center">
          {props.row.original.message_config.status === "expired" ? (
            <Badge variant={"destructive"}>หมดเวลา</Badge>
          ) : (
            <Badge variant={"outline"}>ไม่พบสถานะ</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorFn: (row) =>
      new Date(row.message_config.start_datetime).toLocaleString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    header: "เริ่ม",
  },
  {
    accessorFn: (row) =>
      new Date(row.message_config.end_datetime).toLocaleString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    header: "สิ้นสุด",
  },
];

export const ListContent: React.FC = () => {
  const { data } = useSWR<BeaconResponse>(
    "https://api-beacon.adcm.co.th/api/message",
    fetcher
  );

  const navigate = useNavigate();
  const navigateToCreate = () => {
    navigate("/content/create");
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-[#B28A4C] mb-2 ">คอนเทนต์</h1>
        <button
          onClick={navigateToCreate}
          className="btn outline-none btn-sm  btn-primary text-white flex items-center"
        >
          <Plus /> สร้างคอนเทนต์
        </button>
      </div>
      <DataTable columns={columns} data={data?.response_data.data ?? []} />
    </div>
  );
};

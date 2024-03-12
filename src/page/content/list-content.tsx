import { fetcher } from "@/api";
import { BeaconData, BeaconResponse } from "@/types/message";
import { ColumnDef } from "@tanstack/react-table";
import useSWR from "swr";
import { DataTable } from "../data-table";
import { Badge } from "@/components/ui/badge";
import { Edit, List, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import PaginationCustom from "@/components/PaginationCustom";
import { useState } from "react";
import { cn } from "@/lib/utils";

const generateColumnDefinitions = (
  handleInfo: (beacon: BeaconData) => void,
  handleEdit: (beacon: BeaconData) => void,
  handleDelete: (beacon: BeaconData) => void
): ColumnDef<BeaconData>[] => [
  {
    accessorKey: "campaign_name",
    header: () => (
      <div className="w-[150px]">
        <h1>ชื่อแคมเปญ</h1>
      </div>
    ),
    cell(props) {
      return (
        <div className="flex items-center gap-2 w-[150px] ">
          <p className="truncate">{props.row.original.campaign_name}</p>
        </div>
      );
    },
  },
  {
    // accessorFn: (row) => row.message_config.status,
    accessorKey: "message_config.status",
    header: () => (
      <div className="text-center">
        <h1>สถานะแคมเปญ</h1>
      </div>
    ),

    cell({ row }) {
      const status = row.original.message_config.status;
      const statusText =
        status === "expired"
          ? "หมดอายุ"
          : status === "processing"
          ? "กำลังดำเนินการ"
          : "รอดำเนินการ";

      return (
        <div className="flex justify-center">
          <Badge
            className={cn(
              "w-28 justify-center py-1",
              status === "processing" && "bg-primary",
              status === "processing" && "bg-blue-400 text-white"
            )}
            variant={status === "expired" ? "destructive" : "outline"}
          >
            {statusText}
          </Badge>
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
  {
    accessorKey: "action",
    header: () => (
      <div className="text-center">
        <h1>การดำเนินการ</h1>
      </div>
    ),
    cell({ row }) {
      const status = row.original.message_config.status;
      return (
        // <div className="flex justify-center gap-2">
        //   <button
        //     onClick={() => handleEdit(props.row.original)}
        //     className="btn btn-sm btn-primary text-white"
        //   >
        //     แก้ไข
        //   </button>
        //   <button
        //     className="btn btn-sm btn-error text-white"
        //     onClick={async () => {
        //       const res = await fetch(
        //         `https://api-beacon.adcm.co.th/api/message/${props.row.original.uuid}`,
        //         {
        //           method: "DELETE",
        //           headers: {
        //             "Content-Type": "application/json",
        //             Authorization: "Bearer " + localStorage.getItem("token"),
        //           },
        //         }
        //       );
        //       if (res.ok) {
        //         // alert("ลบสำเร็จ");
        //         window.location.reload();
        //       }
        //       if (!res.ok) {
        //         if (res.status === 403) {
        //           refreshTokensAndRetry(
        //             `https://api-beacon.adcm.co.th/api/message/${props.row.original.uuid}`
        //           );
        //         }
        //       }
        //     }}
        //   >
        //     ลบ
        //   </button>
        // </div>

        <div className="flex justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="rounded-full w-8 h-8  bg-[#B28A4C] hover:bg-[#B28A4C]/80 text-red-500 hover:text-white">
                <span>
                  <MoreHorizontal color="white" size={16} />
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 space-y-2 p-1" align="end">
              <Button
                size={"sm"}
                className="w-full space-x-2 flex justify-start hover:bg-[#B28A4C26]"
                variant={"ghost"}
                onClick={() => {
                  handleInfo(row.original);
                }}
              >
                <List size={18} className="mr-2" /> ดูรายละเอียด
              </Button>
              {status === "processing" ? (
                <Button
                  size={"sm"}
                  className="w-full space-x-2 flex justify-start hover:bg-[#B28A4C26]"
                  variant={"ghost"}
                  onClick={() => {
                    handleEdit(row.original);
                  }}
                >
                  <Edit size={18} className="mr-2" /> แก้ไข
                </Button>
              ) : (
                <Button
                  size={"sm"}
                  className="w-full space-x-2 flex justify-start hover:bg-[#B28A4C26]"
                  variant={"ghost"}
                  onClick={() => {
                    handleEdit(row.original);
                  }}
                >
                  <Edit size={18} className="mr-2" /> แก้ไข
                </Button>
              )}
              <Button
                onClick={() => {
                  handleDelete(row.original);
                }}
                size={"sm"}
                className="w-full flex justify-start text-error bg-white hover:text-error hover:bg-[#B28A4C26]"
                variant={"ghost"}
              >
                <Trash2 size={18} className="mr-2" /> ลบ
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      );
    },
  },
];

export const ListContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = useSWR<BeaconResponse>(
    `https://api-beacon.adcm.co.th/api/message?page=${currentPage}&limit=10`,
    fetcher
  );

  const navigate = useNavigate();
  const navigateToCreate = () => {
    navigate("/content/create");
  };
  const columns = generateColumnDefinitions(
    (beacon) => {
      console.log(beacon);
    },
    (beacon) => {
      navigate(`/content/edit/${beacon.uuid}`);
    },
    (beacon) => {
      console.log(beacon);
    }
  );
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-[#B28A4C] mb-2 ">สร้างสื่อ</h1>
        <button
          onClick={navigateToCreate}
          className="btn outline-none btn-sm  btn-primary text-white flex items-center"
        >
          <Plus /> สร้างสื่อใหม่
        </button>
      </div>
      <DataTable columns={columns} data={data?.response_data.data ?? []} />
      <br />
      <br />

      <PaginationCustom
        currentPage={currentPage}
        pageSize={10}
        totalItems={data?.response_data.pagination.all_rows ?? 0}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

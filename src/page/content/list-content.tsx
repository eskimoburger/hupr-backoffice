import { fetcher } from "@/api";
// import { BeaconData, BeaconResponse } from "@/types/message";
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
import { FC, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { ContentData, ResponseContents } from "@/types/content";
import { format, sub } from "date-fns";
import { th } from "date-fns/locale";

const generateColumnDefinitions = (
  handleInfo: (content: ContentData) => void,
  handleEdit: (content: ContentData) => void,
  handleDelete: (content: ContentData) => void
): ColumnDef<ContentData>[] => [
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
      format(
        sub(new Date(row.message_config.start_datetime), {
          hours: 0,
        }),
        "dd MMMM yyyy เวลา HH:mm:ss",
        { locale: th }
      ),
    header: "เริ่ม",
  },
  {
    accessorFn: (row) =>
      format(
        sub(new Date(row.message_config.end_datetime), {
          hours: 0,
        }),
        "dd MMMM yyyy เวลา HH:mm:ss",
        { locale: th }
      ),
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
              {(status === "processing" || status === null) && (
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
  const [content, setContent] = useState<ContentData | null>(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const { data, mutate } = useSWR<ResponseContents>(
    `https://api-beacon.adcm.co.th/api/message?page=${currentPage}&limit=10`,
    fetcher
  );

  // const [conent];

  const navigate = useNavigate();
  const navigateToCreate = () => {
    navigate("/content/create");
  };
  const columns = generateColumnDefinitions(
    (content) => {
      navigate(`/content/${content.uuid}`);
    },
    (content) => {
      navigate(`/content/edit/${content.uuid}`);
    },
    (content) => {
      setIsOpenDelete(true);
      setContent(content);
    }
  );

  const removeContent = async () => {
    if (content) {
      try {
        const res = await axios.delete(
          `https://api-beacon.adcm.co.th/api/message/${content.uuid}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        if (res.status === 200) {
          setIsOpenDelete(false);
          mutate();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
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

      <DialogDeleteContent
        contentName={content?.campaign_name ?? ""}
        open={isOpenDelete}
        handleClose={setIsOpenDelete}
        handleDeleteContent={() => {
          removeContent();
        }}
      />
    </div>
  );
};

const DialogDeleteContent: FC<{
  contentName: string;
  open: boolean;
  handleClose: (open: boolean) => void;
  handleDeleteContent: () => void;
}> = ({ contentName, open, handleClose, handleDeleteContent }) => {
  return (
    <Dialog open={open} modal onOpenChange={handleClose}>
      <DialogContent className="text-center max-w-xl h-[250px]" closeButton>
        <DialogTitle className="text-2xl text-[#B28A4C]">
          ลบคอนเทนต์
        </DialogTitle>
        <DialogDescription className="text-base font-light">
          <div>
            คุณต้องการลบคอนเทนต์{" "}
            <span className="font-bold">{contentName}</span> ใช่หรือไม่ ?
          </div>
        </DialogDescription>
        <DialogFooter className="flex-col sm:justify-center gap-1">
          <Button
            onClick={handleDeleteContent}
            size={"lg"}
            variant="destructive"
          >
            ลบคอนเทนต์
          </Button>
          <Button
            onClick={() => {
              handleClose(false);
            }}
            size={"lg"}
            className="bg-[#A1A1A1] hover:bg-[#00000026]"
          >
            ยกเลิก
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

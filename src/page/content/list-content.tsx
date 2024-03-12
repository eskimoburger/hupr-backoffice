import { fetcher } from "@/api";
import { BeaconData, BeaconResponse } from "@/types/message";
import { ColumnDef } from "@tanstack/react-table";
import useSWR from "swr";
import { DataTable } from "../data-table";
import { Badge } from "@/components/ui/badge";
import { Check, Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";
import { FC, useState } from "react";
const generateColumnDefinitions = (
  handleEdit: (beacon: BeaconData) => void,
  handleDetail: (beacon: BeaconData) => void,
  handleDelete: (beacon: BeaconData) => void,
): ColumnDef<BeaconData>[] => [
    {
      accessorKey: "campaign_name",
      header: "ชื่อสื่อ",
    },
    {
      // accessorFn: (row) => row.message_config.status,
      accessorKey: "message_config.status",
      header: () => (
        <div className="text-center">
          <h1>สถานะ</h1>
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
      header: "วันที่เริ่มต้น",
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
      header: "วันที่สิ้นสุด",
    },
    {
      accessorKey: "action",
      header: () => null,
      cell(props) {
        const active = props.row.original.message_config.status;
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
                {active == 'expired' ? (
                  <><Button
                    size={"sm"}
                    className="w-full space-x-2 flex justify-start hover:bg-[#B28A4C26]"
                    variant={"ghost"}
                    onClick={() => {
                      handleDetail(props.row.original);
                    }}
                  >
                    <Check size={18} className="mr-2" /> ดูรายละเอียด
                  </Button><Button
                    onClick={() => {
                      handleDelete(props.row.original);
                    }}
                    size={"sm"}
                    className="w-full flex justify-start text-error bg-white hover:text-error hover:bg-[#B28A4C26]"
                    variant={"ghost"}
                  >
                      <Trash2 size={18} className="mr-2" /> ลบ
                    </Button></>
                ) : (


                  <><Button
                    size={"sm"}
                    className="w-full space-x-2 flex justify-start hover:bg-[#B28A4C26]"
                    variant={"ghost"}
                    onClick={() => {
                      handleDetail(props.row.original);
                    }}
                  >
                    <Check size={18} className="mr-2" /> ดูรายละเอียด
                  </Button>
                    <Button
                      size={"sm"}
                      className="w-full space-x-2 flex justify-start hover:bg-[#B28A4C26]"
                      variant={"ghost"}
                      onClick={() => handleEdit(props.row.original)}
                    >
                      <Edit size={18} className="mr-2" /> แก้ไข
                    </Button>
                    <Button
                      onClick={() => handleDelete(props.row.original)}
                      size={"sm"}
                      className="w-full flex justify-start text-error bg-white hover:text-error hover:bg-[#B28A4C26]"
                      variant={"ghost"}
                    >
                      <Trash2 size={18} className="mr-2" /> ลบ
                    </Button>
                  </>
                )}

              </PopoverContent>

            </Popover>
          </div>
        );
      },
    },
  ];

export const ListContent: React.FC = () => {
  const { data } = useSWR<BeaconResponse>(
    "https://api-beacon.adcm.co.th/api/message",
    fetcher
  );
  const [contentEdit, setContentEdit] = useState<BeaconData | null>(null);

  const [openDialogDeleteContent, setOpenDialogDeleteContent] = useState(false);
  const contentDeleteConfirmation = (bencon: BeaconData) => {
    setOpenDialogDeleteContent(true);
    setContentEdit(bencon);
  };
  const navigate = useNavigate();
  const navigateToCreate = () => {
    navigate("/content/create");
  };
  const columns = generateColumnDefinitions((beacon) => {
    navigate(`/content/edit/${beacon.uuid}`);
  }, (beacon) => {
    navigate(`/content/detail/${beacon.uuid}`);
  }, contentDeleteConfirmation);
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
      <DialogDeleteContent
        content={contentEdit}
        open={openDialogDeleteContent}
        handleClose={(open) => {
          setOpenDialogDeleteContent(open);
        }}
      />
    </div>
  );
};

export const DialogDeleteContent: FC<{
  content: BeaconData | null;
  open: boolean;
  handleClose: (open: boolean) => void;
}> = ({ handleClose, open, content }) => {
  const deleteContent = async (contentID: string) => {
    try {
      const response = await axios.delete(
        `https://api-beacon.adcm.co.th/api/message/${contentID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(response);
      handleClose(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog open={open} modal onOpenChange={handleClose}>
      <DialogContent closeButton className="text-center">
        <DialogTitle className="text-2xl text-[#B28A4C]">
          ลบสื่อ
        </DialogTitle>
        <DialogDescription className="text-base font-light">
          <p>คุณต้องการที่ลบสื่อ</p>
          <p>{content?.campaign_name} ใช่หรือไม่ ?</p>
        </DialogDescription>
        <DialogFooter className="flex-col sm:justify-center gap-1">
          <Button
            onClick={() => {
              if (content) {
                deleteContent(content.uuid);
              }
            }}
            size={"sm"}
            variant="destructive"
          >
            ลบสื่อ
          </Button>
          <Button
            onClick={() => {
              handleClose(false);
            }}
            size={"sm"}
            variant={"ghost"}
          >
            ยกเลิก
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
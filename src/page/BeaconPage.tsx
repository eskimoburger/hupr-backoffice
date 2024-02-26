import useSWR from "swr";
import { fetcher } from "@/api";
import { DataTable } from "./data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Device, ResponseDevice } from "@/types/device";
import Beacon from "@/assets/beacon.png";
import { useEffect, useState } from "react";
import PaginationCustom from "@/components/PaginationCustom";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";
import { Save, Trash2, X } from "lucide-react";

const columns: ColumnDef<Device>[] = [
  {
    accessorKey: "avatar",
    header: () => null,
    cell() {
      return (
        <div className="avatar">
          <div className="w-12 rounded-full ">
            <img src={Beacon} alt="Beacon" />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "hw_id",
    header: "รหัสอุปกรณ์",
  },
  {
    accessorKey: "name",
    header: "ชื่ออุปกรณ์",
  },
  {
    accessorKey: "datetime",
    header: "วันที่เพิ่มอุปกรณ์",
    cell(props) {
      return new Date(props.row.original.datetime).toLocaleString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    },
  },
  {
    accessorKey: "action",
    header: () => <div className="text-center">ดำเนินการ</div>,
    cell(props) {
      return (
        <div className="flex space-x-2 justify-center">
          <DrawerDevice device={props.row.original} />
        </div>
      );
    },
  },
];

const BeaconPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const { data: devices } = useSWR<ResponseDevice>(
    `https://api-beacon.adcm.co.th/api/device?limit=10&page=${currentPage}`,
    fetcher
  );

  useEffect(() => {
    if (devices) {
      setTotalItems(devices.response_data.pagination.all_rows);
    }
  }, [devices]);

  console.log(devices);
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#B28A4C] mb-2">บีคอน</h1>

      <DataTable columns={columns} data={devices?.response_data.data ?? []} />
      <br />
      <PaginationCustom
        currentPage={currentPage}
        pageSize={10}
        totalItems={totalItems}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default BeaconPage;

function DrawerDevice({ device }: Readonly<{ device: Device }>) {
  const [deviceName, setDeviceName] = useState(device.name);
  const [isEdit, setIsEdit] = useState(false);
  return (
    <Drawer
      direction="right"
      onClose={() => {
        setDeviceName(device.name);
      }}
    >
      <DrawerTrigger asChild>
        <Button variant="outline">แก้ไข</Button>
      </DrawerTrigger>
      <DrawerContent className="top-0 right-0 left-auto mt-0 w-[350px]  rounded-none  ">
        <div className="mx-auto w-full p-5 overflow-y-auto overflow-x-hidden h-screen ">
          <div className="flex items-center justify-between ">
            <div>
              <div className="font-bold text-xl text-[#B28A4C]">
                HWID: {device.hw_id}
              </div>
              <div className="text-sm font-extralight">
                {new Date(device.datetime).toLocaleString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
            </div>
            <DrawerClose
              onClick={() => {
                setDeviceName(device.name);
              }}
            >
              <X size={18} />
            </DrawerClose>
          </div>
          <div>
            <input
              type="text"
              className="input input-bordered bg-white w-full mt-4 input-sm"
              value={deviceName}
              onChange={(e) => {
                setDeviceName(e.target.value);
                setIsEdit(true);
              }}
            />
            {isEdit && (
              <div className="flex items-center justify-end mt-4 gap-2">
                <Button
                  onClick={() => {
                    setDeviceName(device.name);
                    setIsEdit(false);
                  }}
                  size={"sm"}
                  variant="link"
                  className=" flex items-center gap-2 text-error "
                >
                  <X /> ยกเลิก
                </Button>
                <Button
                  size={"sm"}
                  variant="default"
                  className=" flex items-center gap-2 bg-[#B28A4C] text-white hover:bg-[#B28A4C]/80 hover:text-white"
                >
                  <Save /> บันทึก
                </Button>
              </div>
            )}
          </div>
        </div>

        <DrawerFooter>
          <Button
            variant="destructive"
            className="w-full flex items-center gap-2"
          >
            <Trash2 /> ลบอุปกรณ์
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

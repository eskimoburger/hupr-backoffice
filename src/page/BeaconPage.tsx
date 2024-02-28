/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from "swr";
import { fetcher } from "@/api";
import { DataTable } from "./data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Device, ResponseDevice } from "@/types/device";
import Beacon from "@/assets/beacon.png";
import { useEffect, useRef, useState } from "react";
import PaginationCustom from "@/components/PaginationCustom";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";
import { Save, Trash2, X, SquarePen, MoreHorizontal } from "lucide-react";
import { MapPin } from 'lucide-react';
import axios from "axios";

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
          <DrawerEditDevice device={props.row.original} />
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
  const [isEdit, setIsEdit] = useState(true);

  const ButtonRef = useRef<HTMLButtonElement>(null)

  const updateRecord = (rowdata: any) => {
    axios.put('https://api-beacon.adcm.co.th/api/device/' + rowdata.uuid,
      {
        name: deviceName

      },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      }

    )
      .then(res => {
        console.log(res)
        ButtonRef?.current?.click()
        window.location.reload()
      }).catch(err => {
        console.log(err)
      })
  }


  const delectRecord = (rowdata: any) => {
    axios.delete('https://api-beacon.adcm.co.th/api/device/' + rowdata.uuid,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`

        }
      })
      .then(res => {
        console.log(res)
        ButtonRef?.current?.click()
        window.location.reload()
      }).catch(err => {
        console.log(err)
      })
  }

  return (
    <Drawer
      direction="right"
      onClose={() => {
        setDeviceName(device.name);
      }}
    >
      <DrawerTrigger asChild>
        <Button
          size={"sm"}
          variant="default"
          className=" flex items-center gap-2 bg-[#B28A4C] w-[250px] text-white text-xl hover:bg-[#B28A4C]/80 hover:text-white"
        >
          <SquarePen /> แก้ไข
        </Button>
      </DrawerTrigger>
      <DrawerContent className="top-0 right-0 left-auto mt-0 w-[500px]  rounded-none  ">
        <div className="mx-auto w-full p-5 overflow-y-auto overflow-x-hidden h-screen ">
          <div className="flex items-center justify-between ">
            <div>
              <div className="font-bold text-2xl text-[#B28A4C]">
                HWID: {device.hw_id}
              </div>
              <div className="text-xl font-extralight">
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
              className="input input-bordered bg-white w-full mt-4 input-lg"
              value={deviceName}
              onChange={(e) => {
                setDeviceName(e.target.value);
                setIsEdit(true);
              }}
            />
            {isEdit && (

              <div className="flex items-center justify-between mt-4 gap-2">
                <Button
                  onClick={() => {
                    setDeviceName(device.name);
                    setIsEdit(false);
                  }}
                  size={"sm"}
                  variant="link"
                  className="flex items-center gap-2 bg-[#A1A1A1] w-[250px] text-white text-xl hover:bg-[#A1A1A1]/80 hover:text-white"
                >
                  <X /> ยกเลิก
                </Button>
                <Button
                  onClick={() => { updateRecord(device) }}
                  size={"sm"}
                  variant="default"
                  className=" flex items-center gap-2 bg-[#B28A4C] w-[250px] text-white text-xl hover:bg-[#B28A4C]/80 hover:text-white"
                >
                  <Save /> บันทึก
                </Button>


                <dialog id="my_modal_1" className="modal">
                  <div className="modal-box text-center">
                    <h3 className="font-bold text-lg text-[#B28A4C]">ลบอุปกรณ์บีคอน</h3>
                    <p className="pt-4">คุณต้องการที่จะลบอุปกรณ์บีคอน</p>
                    <p >{device.name} ใช่หรือไม่ ?</p>
                    <form method="dialog" className="pt-6 grid grid-cols-2  place-items-center" >
                      <button className="btn bg-[#E34545] text-[#FFFFFF]" type="submit" onClick={() => { delectRecord(device) }}>ลบผู้ใช้งาน</button>
                      <button className="btn bg-[#A1A1A1] text-[#FFFFFF]">ยกเลิก</button>
                    </form>
                  </div>
                </dialog>




              </div>
            )}
          </div>
        </div>

        <DrawerFooter>

        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function DrawerEditDevice({ device }: Readonly<{ device: Device }>) {
  const [deviceName, setDeviceName] = useState(device.name);
  const ButtonRef = useRef<HTMLButtonElement>(null)



  const delectRecord = (rowdata: any) => {
    axios.delete('https://api-beacon.adcm.co.th/api/device/' + rowdata.uuid,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`

        }
      })
      .then(res => {
        console.log(res)
        ButtonRef?.current?.click()
        window.location.reload()
      }).catch(err => {
        console.log(err)
      })
  }

  return (
    <Drawer
      direction="right"
      onClose={() => {
        setDeviceName(device.name);
      }}
    >
      <DrawerTrigger asChild>
      <button className="btn-xs btn-circle bg-[#B28A4C] hover:bg-[#B28A4C]/80 hover:text-white">
      <MoreHorizontal className="text-[#FFFFFF]  rounded-full" />
</button>
       

      </DrawerTrigger>
      <DrawerContent className="top-0 right-0 left-auto mt-0 w-[500px]  rounded-none  ">
        <div className="mx-auto w-full p-5 overflow-y-auto overflow-x-hidden h-screen ">
          <div className="flex items-center justify-between ">
            <div>
              <div className="font-bold text-2xl text-[#B28A4C]">
                HWID: {device.hw_id}
              </div>
              <div className="text-xl font-extralight">
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
            <div className="flex items-center mt-4 mb-4">
              <div
                className="w-12 h-12   bg-[#B28A4C] rounded-full item-center flex justify-center pt-1 "
              >
                <MapPin className="text-[#FFFFFF] w-10 h-10" />
              </div>
              <div className="ml-10 ">
                <div className="font-bold text-2xl text-[#666666]">
                  ชื่ออุปกรณ์
                </div>
                <div className="text-xl font-extralight">
                  {deviceName}
                </div>
              </div>

            </div>

            <div className="flex items-center justify-between mt-4 gap-2">
              <Button
                onClick={() => { (document.getElementById('my_modal_1') as HTMLDialogElement)?.showModal(); }}
                size={"sm"}
                variant="default"
                className=" flex items-center gap-2 bg-[#E34545] w-[250px] text-white text-xl hover:bg-[#E34545]/80 hover:text-white"
              >
                <Trash2 /> ลบอุปกรณ์
              </Button>
              <DrawerDevice device={device} />
              <dialog id="my_modal_1" className="modal">
                <div className="modal-box text-center">
                  <h3 className="font-bold text-lg text-[#B28A4C]">ลบอุปกรณ์บีคอน</h3>
                  <p className="pt-4">คุณต้องการที่จะลบอุปกรณ์บีคอน</p>
                  <p >{device.name} ใช่หรือไม่ ?</p>
                  <form method="dialog" className="pt-6 grid grid-cols-2  place-items-center" >
                    <button className="btn bg-[#E34545] text-[#FFFFFF]" type="submit" onClick={() => { delectRecord(device) }}>ลบผู้ใช้งาน</button>
                    <button className="btn bg-[#A1A1A1] text-[#FFFFFF]">ยกเลิก</button>
                  </form>
                </div>
              </dialog>




            </div>

          </div>
        </div>

        <DrawerFooter>

        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

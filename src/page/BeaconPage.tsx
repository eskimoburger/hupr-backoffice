/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from "swr";
import { fetcher } from "@/api";
import { DataTable } from "./data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Device, ResponseDevice } from "@/types/device";
import Beacon from "@/assets/beacon.png";
import { FC, useEffect, useMemo, useState } from "react";
import PaginationCustom from "@/components/PaginationCustom";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";
import { Save, Trash2, X, MoreHorizontal, Edit } from "lucide-react";
import { MapPin } from 'lucide-react';
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

const generateColumnDefinitions = (
  handleEdit: (device: Device) => void,
): ColumnDef<Device>[] => [
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
      header: () => null,
      cell(props) {
        return (
          <div className="flex space-x-2 justify-center">
            <Button onClick={() => {
              handleEdit(props.row.original);
            }} className="rounded-full w-8 h-8  bg-[#B28A4C] hover:bg-[#B28A4C]/80 text-red-500 hover:text-white">
              <span>
                <MoreHorizontal color="white" size={16} />
              </span>
            </Button>
          </div>
        );
      },
    },
  ];

const BeaconPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [deviceEdit, setDeviceEdit] = useState<Device | null>(null);
  const [openDrawerDevice, setOpenDrawerDevice] = useState(false);
  const [openDrawerEditDevice, setOpenDrawerEditDevice] = useState(false);
  const [openDrawerDeleteDevice, setOpenDrawerDeleteDevice] = useState(false);

  const showEditDeviceDrawer = (device: Device) => {
    setDeviceEdit(device);
    setOpenDrawerDevice(true);
  }


  const { data: devices } = useSWR<ResponseDevice>(
    `https://api-beacon.adcm.co.th/api/device?limit=10&page=${currentPage}`,
    fetcher
  );

  useEffect(() => {
    if (devices) {
      setTotalItems(devices.response_data.pagination.all_rows);
    }
  }, [devices]);

  const columns = useMemo(
    () =>
      generateColumnDefinitions(
        showEditDeviceDrawer,
      ),
    []
  );
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#B28A4C] mb-2">บีคอน</h1>

      <DataTable columns={columns} data={devices?.response_data.data ?? []} />
      <DeviceDrawer
        device={deviceEdit}
        open={openDrawerDevice}
        handleClose={(open) => {
          setOpenDrawerDevice(open);
        }}
        handleOpenEdit={() => {
          setOpenDrawerEditDevice(true);
          setOpenDrawerDevice(false);
        }}
        handleOpenDelect={() => {
          setOpenDrawerDeleteDevice(true);
          setOpenDrawerDevice(false);
        }}
      />
      <DeviceDrawerEdit
        device={deviceEdit}
        open={openDrawerEditDevice}
        handleClose={(open) => {
          setOpenDrawerEditDevice(open);
        }}
      />
      <DiologDeleteDevice
        device={deviceEdit}
        open={openDrawerDeleteDevice}
        handleClose={(open) => {
          setOpenDrawerDeleteDevice(open);
        }}
      />
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


const DeviceDrawer: FC<{
  device: Device | null;
  open: boolean;
  handleClose: (open: boolean) => void;
  handleOpenEdit: () => void;
  handleOpenDelect: () => void;
}> = ({ device, open, handleClose, handleOpenEdit, handleOpenDelect }) => {
  const [deviceName, setDeviceName] = useState("");

  useEffect(() => {
    if (device) {
      setDeviceName(device.name);
    }
  }, [device]);

  if (!device) {
    return null;
  }

  return (
    <Drawer open={open} onOpenChange={handleClose} direction="right" >
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
                onClick={handleOpenDelect} size={"sm"}
                variant="default"
                className=" flex items-center gap-2 bg-[#E34545] w-[250px] text-white text-xl hover:bg-[#E34545]/80 hover:text-white"
              >
                <Trash2 /> ลบอุปกรณ์
              </Button>


              <Button
                onClick={handleOpenEdit}
                size={"sm"}
                variant="default"
                className=" flex items-center gap-2 bg-[#B28A4C] w-[250px] text-white text-xl hover:bg-[#B28A4C]/80 hover:text-white"

              >
                <Edit className="mr-2" /> แก้ไข
              </Button>






            </div>

          </div>
        </div>

        <DrawerFooter>

        </DrawerFooter>
      </DrawerContent>
    </Drawer>

  )
}

const DeviceDrawerEdit: FC<{
  device: Device | null;
  open: boolean;
  handleClose: (open: boolean) => void;
}> = ({ device, open, handleClose }) => {
  const [deviceName, setDeviceName] = useState("");
  const [isEdit, setIsEdit] = useState(false);
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
        window.location.reload()
      }).catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (device) {
      setDeviceName(device.name);
    }
  }, [device]);
  if (!device) {
    return null;
  }
  return (
    <Drawer
      open={open}
      onOpenChange={handleClose}
      direction="right"
      onClose={() => {
        setDeviceName(device.name);

      }
      }
    >
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
                  onClick={() => { updateRecord(device) }}
                  size={"sm"}
                  variant="default"
                  className=" flex items-center gap-2 bg-[#B28A4C] w-[250px] text-white text-xl hover:bg-[#B28A4C]/80 hover:text-white"
                >
                  <Save /> บันทึก
                </Button>

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
              </div>
            )}
          </div>
        </div>

        <DrawerFooter>

        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}


const DiologDeleteDevice: FC<{
  device: Device | null;
  open: boolean;
  handleClose: (open: boolean) => void;
}> = ({ device, open, handleClose }) => {
  const delectRecord = (rowdata: any) => {
    axios.delete('https://api-beacon.adcm.co.th/api/device/' + rowdata.uuid,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`

        }
      })
      .then(res => {
        console.log(res)
        window.location.reload()
      }).catch(err => {
        console.log(err)
      })
  }
  return (
    <Dialog open={open} modal onOpenChange={handleClose} >
      <DialogContent className="text-center">
        <DialogTitle className="text-2xl text-[#B28A4C]">
          ลบผู้ใช้งาน
        </DialogTitle>
        <DialogDescription className="text-base font-light">
          <p>คุณต้องการที่จะลบอุปกรณ์บีคอน</p>
          <p>{device?.name} ใช่หรือไม่ ?</p>
        </DialogDescription>
        <DialogFooter className="flex-col sm:justify-center gap-1">
          <Button
            onClick={() => {
              if (device) {
                delectRecord(device);
              }
            }}
            size={"sm"}
            variant="destructive"
          >
            ลบอุปกรณ์
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
  )
}


/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from "@tanstack/react-table";
import { fetcher } from "@/api";
import useSWR from "swr";
import { DataTable } from "./data-table";
import { FC, useEffect, useMemo, useState } from "react";
import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer";
import { Check, Edit, MoreHorizontal, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import axios from "axios";
import { MemberType, ResponseMember } from "@/types/member";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import GroupPerson from "@/assets/group-person";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const generateColumnDefinitions = (
  handleEdit: (member: MemberType) => void,
  handleDelete: (member: MemberType) => void,
  handleApprove: (member: MemberType) => void
): ColumnDef<MemberType>[] => [
  {
    accessorKey: "avatar",
    header: () => null,
    cell(props) {
      const urlpic =
        props.row.original.picture ?? "https://avatar.iran.liara.run/public/5";
      return (
        <div className="avatar">
          <div className="w-12 rounded-full">
            <img src={urlpic} alt={props.row.original.first_name} />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "อีเมล",
    cell(props) {
      return (
        <div className="flex items-center">
          <div className="text-sm ">{props.row.original.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "ชื่อ",
    cell(props) {
      return (
        <div className="flex items-center">
          <div className="text-sm ">{props.row.original.first_name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "surename",
    header: "นามสกุล",
    cell(props) {
      return (
        <div className="flex items-center">
          <div className="text-sm ">{props.row.original.last_name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "ตำแหน่ง",
    cell(props) {
      return (
        <div className="flex items-center">
          <div className="text-sm ">
            {props.row.original.role === "admin" ? "แอดมิน" : "ผู้ดำเนินการ"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">สถานะ</div>,
    cell(props) {
      return (
        <div className="flex justify-center ">
          <div className="text-sm ">
            {props.row.original.active ? (
              <div className=" bg-[#EBF4E4]  px-4 py-1.5 text-[#97B67F] rounded-xl text-center">
                ใช้งานอยู่
              </div>
            ) : (
              <div className=" bg-[#5BC4FF33] px-4 py-1.5  text-[#5BC4FF] rounded-xl text-center">
                รออนุมัติ
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: () =>  null,
    cell(props) {
      const active = props.row.original.active;
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
              {active ? (
                <Button
                  size={"sm"}
                  className="w-full space-x-2 flex justify-start hover:bg-[#B28A4C26]"
                  variant={"ghost"}
                  onClick={() => {
                    handleEdit(props.row.original);
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
                    handleApprove(props.row.original);
                  }}
                >
                  <Check size={18} className="mr-2" /> อนุมัติ
                </Button>
              )}
              <Button
                onClick={() => {
                  handleDelete(props.row.original);
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

const MemberDrawerEdit: FC<{
  member: MemberType | null;
  open: boolean;
  handleClose: (open: boolean) => void;
}> = ({ member, open, handleClose }) => {
  const [memberName, setMemberName] = useState("");
  const [memberSurename, setMemberSurename] = useState("");
  const [memberActive, setMemberActive] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const updateRecord = (rowData: MemberType) => {
    axios
      .put(
        "https://api-beacon.adcm.co.th/api/user/" + rowData.uuid,
        {
          first_name: memberName,
          last_name: memberSurename,
          active: memberActive,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (member) {
      setMemberName(member.first_name);
      setMemberSurename(member.last_name);
      setMemberActive(member.active);
    }
  }, [member]);
  if (!member) return null;
  return (
    <Drawer
      open={open}
      onOpenChange={handleClose}
      direction="right"
      onClose={() => {
        setMemberName(member.first_name);
        setMemberSurename(member.last_name);
        setMemberActive(member.active);
      }}
    >
      <DrawerContent className="top-0 right-0 left-auto mt-0 w-[400px]  rounded-none  ">
        <div className="mx-auto w-full p-5 overflow-y-auto overflow-x-hidden h-screen ">
          <div className="flex items-center justify-between ">
            <div>
              <div className="font-bold text-xl text-[#B28A4C]">
                {member.email}
              </div>
            </div>
            <DrawerClose
              onClick={() => {
                setMemberName(member.first_name);
                handleClose(false);
              }}
            >
              <X size={18} />
            </DrawerClose>
          </div>
          <div className="flex flex-col gap-4 mt-4 w-full">
            <div className=" form-control gap-2">
              <Label htmlFor="name">
                <span>ชื่อ</span>
              </Label>
              <Input
                type="text"
                id="name"
                placeholder="ชื่อ"
                value={memberName}
                onChange={(e) => {
                  setMemberName(e.target.value);
                  setIsEdit(true);
                }}
              />
            </div>
            <div className=" form-control gap-2">
              <Label htmlFor="last_name">
                <span>นามสกุล</span>
              </Label>
              <Input
                type="text"
                id="last_name"
                placeholder="นามสกุล"
                value={memberSurename}
                onChange={(e) => {
                  setMemberSurename(e.target.value);
                  setIsEdit(true);
                }}
              />
            </div>
      

            {isEdit && (
              <div className="grid grid-cols-2 gap-6 mx-3">
                <Button
                  onClick={() => {
                    updateRecord(member);
                  }}
                  size={"sm"}
                  variant="default"
                  className="bg-[#B28A4C] hover:bg-[#B28A4C]/80"
                >
                  บันทึก
                </Button>
                <Button
                  onClick={() => {
                    setMemberName(member.first_name);
                    setMemberSurename(member.last_name);
                    setMemberActive(member.active);
                    setIsEdit(false);
                  }}
                  size={"sm"}
                  variant="ghost"
                >
                  ยกเลิก
                </Button>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const MemberDrawer: FC<{
  member: MemberType | null;
  open: boolean;
  handleClose: (open: boolean) => void;
  handleOpenEdit: () => void;
}> = ({ member, open, handleClose, handleOpenEdit }) => {
  const [memberName, setMemberName] = useState("");
  const [memberSurename, setMemberSurename] = useState("");

  useEffect(() => {
    if (member) {
      setMemberName(member.first_name);
      setMemberSurename(member.last_name);
    }
  }, [member]);

  if (!member) return null;

  return (
    <Drawer open={open} onOpenChange={handleClose} direction="right">
      <DrawerContent className="top-0 right-0 left-auto mt-0 w-[400px]  rounded-none  ">
        <div className="mx-auto w-full p-5 overflow-y-auto overflow-x-hidden h-screen ">
          <div className="flex items-center justify-between ">
            <div>
              <div className="font-bold text-xl text-[#B28A4C]">
                {member.email}
              </div>
            </div>
            <DrawerClose
              onClick={() => {
                setMemberName(member.first_name);
              }}
            >
              <X size={18} />
            </DrawerClose>
          </div>
          <div className="my-14" />
          <div className="flex flex-col gap-4  w-full">
            <div className="flex items-center ">
              <div className="ml-10 ">
                <div className="font-bold text-xl text-[#666666]">ชื่อ</div>
                <div className="text-normal font-extralight">{memberName}</div>
              </div>
            </div>
            <hr />
            <div className="flex items-center ">
              <div className="ml-10 ">
                <div className="font-bold text-xl text-[#666666]">นามสกุล</div>
                <div className="text-normal font-extralight">
                  {memberSurename}
                </div>
              </div>
            </div>
            <hr />

            <div className="flex items-center justify-end  gap-2">
              <Button
                onClick={handleOpenEdit}
                size={"sm"}
                variant="default"
                className="bg-[#B28A4C] hover:bg-[#B28A4C]/80 "
                // className=" flex items-center gap-2 bg-[#E34545] w-[250px] text-white text-xl hover:bg-[#E34545]/80 hover:text-white"
              >
                <Edit className="mr-2" /> แก้ไข
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export const DialogDeleteMember: FC<{
  member: MemberType | null;
  open: boolean;
  handleClose: (open: boolean) => void;
}> = ({ handleClose, open, member }) => {
  const deleteMember = async (memberId: string) => {
    try {
      const response = await axios.delete(
        `https://api-beacon.adcm.co.th/api/user/${memberId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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
          ลบผู้ใช้งาน
        </DialogTitle>
        <DialogDescription className="text-base font-light">
          <p>คุณต้องการที่จะลบผู้ใช้งาน</p>
          <p>{member?.email} ใช่หรือไม่ ?</p>
        </DialogDescription>
        <DialogFooter className="flex-col sm:justify-center gap-1">
          <Button
            onClick={() => {
              if (member) {
                deleteMember(member.uuid);
              }
            }}
            size={"sm"}
            variant="destructive"
          >
            ลบผู้ใช้งาน
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
const DialogApproveMember: FC<{
  member: MemberType | null;
  open: boolean;
  handleClose: (open: boolean) => void;
}> = ({ handleClose, open, member }) => {
  const approveMember = async (memberId: string) => {
    try {
      const response = await axios.put(
        `https://api-beacon.adcm.co.th/api/user/${memberId}`,
        {
          active: true,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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
          อนุมัติผู้ใช้งาน
        </DialogTitle>
        <DialogDescription className="text-base font-light">
          <p>คุณต้องการที่จะอนุมัติผู้ใช้งาน</p>
          <p>{member?.email} ใช่หรือไม่ ?</p>
        </DialogDescription>
        <DialogFooter className="flex-col sm:justify-center gap-1">
          <Button
            onClick={() => {
              if (member) {
                approveMember(member.uuid);
              }
            }}
            size={"sm"}
            className="bg-success hover:bg-success/80"
          >
            อนุมัติผู้ใช้งาน
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

const Member = () => {
  const { data: member } = useSWR<ResponseMember>(
    `https://api-beacon.adcm.co.th/api/user?limit=10`,
    fetcher
  );
  const [memberEmail, setMemberEmail] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberSurename, setMemberSurename] = useState("");

  const [memberEdit, setMemberEdit] = useState<MemberType | null>(null);

  const [openDrawerMember, setOpenDrawerMember] = useState(false);
  const [openDrawerEditMember, setOpenDrawerEditMember] = useState(false);
  const [openDialogDeleteMember, setOpenDialogDeleteMember] = useState(false);
  const [openDialogApproveMember, setOpenDialogApproveMember] = useState(false);

  const showEditMemberDrawer = (member: MemberType) => {
    setMemberEdit(member);
    setOpenDrawerMember(true);
  };
  const memberDeleteConfirmation = (member: MemberType) => {
    setOpenDialogDeleteMember(true);
    setMemberEdit(member);
  };

  const memberApproveConfirmation = (member: MemberType) => {
    setOpenDialogApproveMember(true);
    setMemberEdit(member);
  };
  const addRecord = (member: string, name: string, surename: string) => {
    axios
      .post(
        "https://api-beacon.adcm.co.th/api/user",
        {
          email: member,
          first_name: name,
          last_name: surename,
          role: "admin",
          department_uuid: "dffdedd0-cbd4-11ee-8557-07e6505aa0d7",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        alert("เพิ่มสมาชิกสำเร็จ");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        alert("เพิ่มสมาชิกไม่สำเร็จ");
      });
  };

  const columns = useMemo(
    () =>
      generateColumnDefinitions(
        showEditMemberDrawer,
        memberDeleteConfirmation,
        memberApproveConfirmation
      ),
    []
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-[#B28A4C] mb-2">สมาชิก</h1>
        <button
          onClick={() =>
            (
              document.getElementById("createmember") as HTMLDialogElement
            )?.showModal()
          }
          className="btn outline-none btn-xl  btn-primary text-white flex items-center justify-center"
        >
          <Plus size={18} /> เพิ่มผู้ใช้
        </button>
        <dialog id="createmember" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg text-center text-[#B28A4C]">
              เพิ่มผู้ใช้
            </h3>
            <div className="flex flex-col gap-4 mt-4 w-full ">
              <div>
                อีเมล {" "}
                <input
                  type="text"
                  placeholder="กรุณากรอกอีเมล"
                  className="input input-bordered bg-white w-full mt-2 input-sm"
                  value={memberEmail}
                  onChange={(e) => {
                    setMemberEmail(e.target.value);
                  }}
                />
              </div>

              <div>
                ชื่อ {" "}
                <input
                  type="text"
                  placeholder="กรุณากรอกชื่อ"
                  className="input input-bordered bg-white w-full mt-2 input-sm"
                  value={memberName}
                  onChange={(e) => {
                    setMemberName(e.target.value);
                  }}
                />
              </div>

              <div>
                นามสกุล {" "}
                <input
                  type="text"
                  placeholder="กรุณากรอกนามสกุล"
                  className="input input-bordered bg-white w-full mt-2 input-sm"
                  value={memberSurename}
                  onChange={(e) => {
                    setMemberSurename(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-sm px-16 text-[#FFFFFF] bg-[#B28A4C]  "
                onClick={() => {
                  addRecord(memberEmail, memberName, memberSurename);
                }}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </dialog>
      </div>

      <DataTable columns={columns} data={member?.response_data.data ?? []} />
      <MemberDrawer
        member={memberEdit}
        open={openDrawerMember}
        handleClose={(open) => {
          setOpenDrawerMember(open);
        }}
        handleOpenEdit={() => {
          setOpenDrawerEditMember(true);
          setOpenDrawerMember(false);
        }}
      />
      <MemberDrawerEdit
        member={memberEdit}
        open={openDrawerEditMember}
        handleClose={(open) => {
          setOpenDrawerEditMember(open);
        }}
      />
      <DialogDeleteMember
        member={memberEdit}
        open={openDialogDeleteMember}
        handleClose={(open) => {
          setOpenDialogDeleteMember(open);
        }}
      />
      <DialogApproveMember
        member={memberEdit}
        open={openDialogApproveMember}
        handleClose={(open) => {
          setOpenDialogApproveMember(open);
        }}
      />
    </div>
  );
};

export default Member;

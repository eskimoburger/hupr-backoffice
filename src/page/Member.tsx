/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table'
import { fetcher } from "@/api";
import useSWR from "swr";
import { DataTable } from "./data-table";
import { useRef, useState } from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Save, Trash2, X } from "lucide-react";
import axios from 'axios';
import { MemberType, ResponseMember } from "@/types/member";


const columns: ColumnDef<MemberType>[] = [
    {
        accessorKey: 'avatar',
        header: () => null,
        cell(props) {
            const urlpic = props.row.original.picture ?? 'https://avatar.iran.liara.run/public/5'
            return (
                <div className="avatar">
                    <div className="w-12 rounded-full">
                        <img
                            src={urlpic}
                            alt={props.row.original.first_name}
                        />
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'email',
        header: 'อีเมล',
        cell(props) {
            return (
                <div className="flex items-center">
                    <div className="text-sm ">{props.row.original.email}</div>
                </div>

            )
        }
    },
    {
        accessorKey: 'name',
        header: 'ชื่อ',
        cell(props) {
            return (
                <div className="flex items-center">
                    <div className="text-sm ">{props.row.original.first_name}</div>
                </div>

            )
        }
    },
    {
        accessorKey: 'surename',
        header: 'นามสกุล',
        cell(props) {
            return (
                <div className="flex items-center">
                    <div className="text-sm ">{props.row.original.last_name}</div>
                </div>

            )
        }
    },
    {
        accessorKey: 'role',
        header: 'ตำแหน่ง',
        cell(props) {
            return (
                <div className="flex items-center">
                    <div className="text-sm ">{props.row.original.role === 'admin' ? 'แอดมิน' : 'ผู้ดำเนินการ'}</div>
                </div>
            )
        }
    },
    {
        accessorKey: 'status',
        header: 'สถานะ',
        cell(props) {
            return (
                <div className="flex justify-center w-[120px]">
                    <div className="text-sm ">{props.row.original.active ?
                        <div className=" bg-[#EBF4E4] w-[120px] text-[#97B67F] rounded-full text-center">
                            อนุมัติ
                        </div>
                        :
                        <div className=" bg-[#5BC4FF33] w-[120px] text-[#5BC4FF] rounded-full text-center">
                            รออนุมัติ
                        </div>
                    }</div>
                </div>
            )

        }
    },
    {
        accessorKey: 'action',
        header: () => <div className="text-center">ดำเนินการ</div>,
        cell(props) {
            return (

                <div className="flex space-x-2 justify-center">
                    <DrawerDevice member={props.row.original} />
                </div>


            )

        }

    }
]

const Member = () => {
    const { data: member } = useSWR<ResponseMember>(
        `https://api-beacon.adcm.co.th/api/user?limit=10`,
        fetcher
    );
    const [memberEmail, setMemberEmail] = useState('');
    const [memberName, setMemberName] = useState('');
    const [memberSurename, setMemberSurename] = useState('');

    console.log('member', member)

    const addRecord = (member : string, name : string , surename : string) => {
        axios.post('https://api-beacon.adcm.co.th/api/user',
            {
                email: member,
                first_name: name,
                last_name: surename,
                role: 'admin',
                department_uuid: "dffdedd0-cbd4-11ee-8557-07e6505aa0d7"
            },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            .then(res => {
                console.log(res)
                alert('เพิ่มสมาชิกสำเร็จ')
                window.location.reload()
            }).catch(
                err => {
                    console.log(err)
                    alert('เพิ่มสมาชิกไม่สำเร็จ')
                }
            )
    }


    return (
        <div >
            <div
                className="flex justify-between items-center mb-2"
            >
                <h1 className="text-3xl font-bold text-[#B28A4C] mb-2">สมาชิก</h1>
                <button
                    onClick={() => (document.getElementById('createmember') as HTMLDialogElement)?.showModal()}
                    className="btn outline-none btn-sm  btn-primary text-white flex items-center"
                >
                    <Plus /> เพิ่มผู้ใช้
                </button>
                <dialog id="createmember" className="modal">
                    <div className="modal-box">
                        <form method="dialog">

                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h3 className="font-bold text-lg text-center text-[#B28A4C]">เพิ่มผู้ใช้</h3>
                        <div className="flex flex-col gap-4 mt-4 w-full ">
                            <div>
                                อีเมล : <input
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
                                ชื่อ : <input
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
                                นามสกุล : <input
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
                            <button className="btn text-[#FFFFFF] bg-[#B28A4C]"
                                onClick={() => {
                                    addRecord(memberEmail, memberName, memberSurename)
                                }}
                            >บันทึก</button>
                        </div>
                    </div>
                </dialog>
            </div>

            <DataTable columns={columns} data={member?.response_data.data ?? []} />
        </div>
    )
}

export default Member;

function DrawerDevice({ member }: Readonly<{ member: MemberType }>) {
    const [memberName, setMemberName] = useState(member.first_name);
    const [memberSurename, setMemberSurename] = useState(member.last_name);
    const [memberActive, setMemberActive] = useState(member.active);
    const [isEdit, setIsEdit] = useState(false);

    const ButtonRef = useRef<HTMLButtonElement>(null)


    const updateRecord = (rowdata: any) => {
        axios.put('https://api-beacon.adcm.co.th/api/user/' + rowdata.uuid,
            {
                first_name: memberName,
                last_name: memberSurename,
                active: memberActive

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
        axios.delete('https://api-beacon.adcm.co.th/api/user/' + rowdata.uuid,
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
                setMemberName(member.first_name);
                setMemberSurename(member.last_name);
            }}
        >
            <DrawerTrigger asChild>
                <Button variant="outline">แก้ไข</Button>
            </DrawerTrigger>
            <DrawerContent className="top-0 right-0 left-auto mt-0 w-[350px]  rounded-none  ">
                <div className="mx-auto w-full p-5 overflow-y-auto overflow-x-hidden h-screen ">
                    <div className="flex items-center justify-between ">
                        <div >


                        </div>
                        <DrawerClose
                            ref={ButtonRef}
                            onClick={() => {
                                setMemberName(member.first_name);
                            }}
                        >
                            <X size={18} />
                        </DrawerClose>
                    </div>
                    <div
                        className='flex flex-col gap-4 mt-4 w-full'
                    >
                        ชื่อ : <input
                            type="text"
                            className="input input-bordered bg-white w-full mt-2 input-sm"
                            value={memberName}
                            onChange={(e) => {
                                setMemberName(e.target.value);
                                setIsEdit(true);
                            }}
                        />
                        นามสกุล : <input
                            type="text"
                            className="input input-bordered bg-white w-full mt-2 input-sm"
                            value={memberSurename}
                            onChange={(e) => {
                                setMemberSurename(e.target.value);
                                setIsEdit(true);
                            }}
                        />
                        สถานะ :
                        <select
                            className="select select-bordered w-full mt-2 max-w-xs"
                            value={memberActive ? 'อนุมัติ' : 'ไม่อนุมัติ'}
                            onChange={(e) => {
                                setMemberActive(e.target.value === 'อนุมัติ' ? true : false);
                                setIsEdit(true);
                            }}
                        >
                            <option>อนุมัติ</option>
                            <option>ไม่อนุมัติ</option>
                        </select>

                        {isEdit && (
                            <div className="flex items-center justify-end mt-4 gap-2">
                                <Button
                                    onClick={() => {
                                        setMemberName(member.first_name);
                                        setMemberSurename(member.last_name);
                                        setMemberActive(member.active);
                                        setIsEdit(false);
                                    }}
                                    size={"sm"}
                                    variant="link"
                                    className=" flex items-center gap-2 text-error "
                                >
                                    <X /> ยกเลิก
                                </Button>
                                <Button
                                    onClick={() => {
                                        updateRecord(member)
                                    }}
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

                        onClick={() => (document.getElementById('my_modal_1') as HTMLDialogElement).showModal()}
                        variant="destructive"
                        className="w-full flex items-center gap-2"
                    >
                        <Trash2 /> ลบผู้ใช้
                    </Button>
                    <dialog id="my_modal_1" className="modal">
                        <div className="modal-box text-center">
                            <h3 className="font-bold text-lg text-[#B28A4C]">ลบผู้ใช้งาน</h3>
                            <p className="pt-4">คุณต้องการที่จะลบผู้ใช้งาน</p>
                            <p >{member.email} ใช่หรือไม่ ?</p>
                            <form method="dialog" className="pt-6 grid grid-cols-2  place-items-center" >
                                <button className="btn bg-[#E34545] text-[#FFFFFF]" type="submit" onClick={() => { delectRecord(member) }}>ลบผู้ใช้งาน</button>
                                <button className="btn bg-[#00000026] text-[#FFFFFF]">ยกเลิก</button>
                            </form>
                        </div>
                    </dialog>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

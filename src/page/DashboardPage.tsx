import { fetcher } from "@/api";
import LineChart from "@/components/LineChart";
import SummaryBox from "@/components/SummaryBox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Device, ResponseDevice } from "@/types/device";
import { ResponseOverview } from "@/types/overview";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { columns } from "./column";
import { DataTable } from "./data-table";
import { ResponseUser } from "@/types/user";
import PaginationCustom from "@/components/PaginationCustom";
import { Download } from 'lucide-react';
import axios from "axios";
import { format } from "date-fns";
import SendIcon from "@/assets/sendicon";
import UserIcon from "@/assets/usericon";
import VisiterIcon from "@/assets/visitericon";


const SelectDevice = ({
  devices,
  handleSelect,
}: {
  devices: Device[];
  handleSelect?: (value: string) => void;
}) => {
  const [selected, setSelected] = useState("0");

  return (
    <Select
      value={selected}
      onValueChange={(value) => {
        setSelected(value);
        handleSelect?.(value);
      }}
    >
      <SelectTrigger className="w-[200px] bg-[#B28A4C33] text-[#666666]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="0">พิกัดทั้งหมดของอุปกรณ์</SelectItem>
        {devices.map((device) => (
          <SelectItem value={device.uuid} key={device.uuid}>
            {device.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const DashboardPage = () => {
  const [selectedDevice, setSelectedDevice] = useState("0");
  const { data } = useSWR<ResponseDevice>(
    "https://api-beacon.adcm.co.th/api/device?limit=9999",
    fetcher
  );

  const { data: overview, isLoading } = useSWR<ResponseOverview>(
    selectedDevice === "0"
      ? "https://api-beacon.adcm.co.th/api/overview"
      : `https://api-beacon.adcm.co.th/api/overview/${selectedDevice}`,
    fetcher
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [importtype, setImportType] = useState("");
  const { data: user, isLoading: userLoading } = useSWR<ResponseUser>(
    selectedDevice === "0"
      ? `https://api-beacon.adcm.co.th/api/overview/user/all-user?limit=5&page=${currentPage}`
      : `https://api-beacon.adcm.co.th/api/overview/user/all-user/${selectedDevice}?limit=5&page=${currentPage}`,
    fetcher
  );

  useEffect(() => {
    if (user) {
      setTotalItems(user.response_data.pagination.all_rows);
    }
  }, [user]);

  useEffect(() => {
    if (selectedDevice) {
      setCurrentPage(1);
    }
  }, [selectedDevice]);

  return (
    <div className="flex flex-col ">
      <div className="grid grid-cols-6 gap-4">
        <div className="col-start-1 col-end-3 ...">
          <h1 className="text-5xl font-bold text-[#B28A4C] mb-2">หน้าหลัก
          </h1>
        </div>
        <div className="col-end-9 col-span-2 ...">
          <details className="dropdown dropdown-end">
            <summary className="m-1 btn outline-none btn-sm  btn-primary text-white "><Download /> ส่งออกข้อมูล</summary>
            <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
              <div className="form-control py-2">

                <div
                  className="flex"
                >
                  <input type="checkbox" className="checkbox border-[#D4D4D4] checked:border-[#B28A4C] [--chkbg:#B28A4C] [--chkfg:white]" value="user" onChange={() => setImportType('user')}  />
                  <div className="text-left flex-1 w-32 pl-2 ">ผู้ใช้</div>

                </div>

                <div
                  className="flex pt-2"

                >
                  <input type="checkbox" className="checkbox border-[#D4D4D4] checked:border-[#B28A4C] [--chkbg:#B28A4C] [--chkfg:white]" value="message" onChange={() => setImportType('message')} />
                  <div className="text-left flex-1 w-32 pl-2 ">ข้อความ</div>

                </div>


                <div
                  className="flex pt-2"

                >
                  <input type="checkbox" className="checkbox border-[#D4D4D4] checked:border-[#B28A4C] [--chkbg:#B28A4C] [--chkfg:white]" value="device" onChange={() => setImportType('device')} />
                  <div className="text-left flex-1 w-32 pl-2 ">อุปกรณ์</div>

                </div>



              </div>

              <hr />
              <div
                className="pt-3 pr-2 pl-3">
                <button
                  onClick={
                    () => {
                      axios.get(`https://api-beacon.adcm.co.th/api/export/` + importtype,
                        {
                          headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,

                          },
                          responseType: 'blob'
                        })
                        .then(response => {
                          const href = window.URL.createObjectURL(response.data);

                          const anchorElement = document.createElement('a');

                          anchorElement.href = href;
                          anchorElement.download = `${format(new Date(), 'dd/MM/yyyy')}_${importtype}`;
                          document.body.appendChild(anchorElement);
                          anchorElement.click();

                          document.body.removeChild(anchorElement);
                          window.URL.revokeObjectURL(href);



                        }).catch(err => {
                          console.log(err)
                        })
                    }
                  }

                  className="btn outline-none btn-sm btn-primary text-white flex items-center justify-center"
                >
                  ยืนยันการส่งออกข้อมูล
                </button>
              </div>


            </ul>
          </details>
        </div>
      </div>


      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-[#666666]">ประสิทธิภาพของเนื้อหา</h2>
        <SelectDevice
          devices={data?.response_data.data ?? []}
          handleSelect={(value) => {
            setSelectedDevice(value);
          }}
        />
      </div>

      <div className="grid  gap-3 my-5 xl:grid-cols-3">
      
        <SummaryBox
        
          label="จำนวนข้อความที่ส่ง"
          value={overview?.response_data.data.card.message_count ?? 0}
          circleColor="bg-[#48DAA5]"
          textLabelColor="text-[#48DAA5]"
          icon={<SendIcon/>}
        />
        
        <SummaryBox
          label="จำนวนผู้ใช้"
          value={overview?.response_data.data.card.user_count ?? 0}
          textLabelColor="text-[#EB96E7] "
          circleColor="bg-[#EB96E7]"
          icon={<UserIcon/>}
        />
        <SummaryBox
          label="จำนวนครั้งที่ผู้ใช้เข้ามาในบีคอน"
          value={overview?.response_data.data.card.visit_count ?? 0}
          textLabelColor="text-[#285FCA]"
          circleColor="bg-[#285FCA]"
          icon={<VisiterIcon/>} 
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="">
          <h2 className="text-2xl text-[#666666] mb-2 ">ภาพรวมกราฟ</h2>
          <div
            className="h-[500px] border-2 rounded-[40px] p-3 
          border-[#B28A4C] shadow-[16px_16px_20px_0px_rgba(178,138,76,0.2)]
        "
          >
            <LineChart
              data={overview?.response_data.data.graph ?? []}
              isLoading={isLoading}
            />
          </div>
        </div>
        <div>
          <h2 className="text-2xl text-[#666666] mb-2 ">ผู้ใช้งานล่าสุด</h2>
          <DataTable
            loading={userLoading}
            columns={columns}
            data={user?.response_data.data ?? []}
          />
          <br />

          <PaginationCustom
            currentPage={currentPage}
            pageSize={10}
            totalItems={totalItems}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

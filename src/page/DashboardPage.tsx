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
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="0">ทั้งหมด</SelectItem>
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
  const { data: user, isLoading: userLoading } = useSWR<ResponseUser>(
    selectedDevice === "0"
      ? `https://api-beacon.adcm.co.th/api/overview/user/all-user?limit=10&page=${currentPage}`
      : `https://api-beacon.adcm.co.th/api/overview/user/all-user/${selectedDevice}?limit=10&page=${currentPage}`,
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
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold text-[#B28A4C] mb-2">ภาพรวม</h1>
      <div className="flex justify-between items-center">
        <h2 className="text-xl text-[#666666]">ประสิทธิภาพของเนื้อหา</h2>
        <SelectDevice
          devices={data?.response_data.data ?? []}
          handleSelect={(value) => {
            setSelectedDevice(value);
          }}
        />
      </div>

      <div className="grid  gap-3 my-5 xl:grid-cols-3">
        <SummaryBox
          label="จำนวนข้อความที่ส่งให้"
          value={overview?.response_data.data.card.user_count ?? 0}
          circleColor="bg-[#48DAA5]"
          textLabelColor="text-[#48DAA5]"
        />
        <SummaryBox
          label="จำนวนผู้ใช้ที่ไม่ซ้ำ"
          value={overview?.response_data.data.card.message_count ?? 0}
          textLabelColor="text-[#EB96E7] "
          circleColor="bg-[#EB96E7]"
        />
        <SummaryBox
          label="จำนวนผู้ใช้ที่เข้ามาใน Beacon"
          value={overview?.response_data.data.card.visit_count ?? 0}
          textLabelColor="text-[#285FCA]"
          circleColor="bg-[#285FCA]"
        />
      </div>

      <div className="mb-5">
        <h2 className="text-xl text-[#666666] mb-2 ">กราฟ</h2>
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
        <h2 className="text-xl text-[#666666] mb-2 ">ผู้ใช้</h2>
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
  );
};

export default DashboardPage;

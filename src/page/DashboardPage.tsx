import { fetcher } from "@/api";
import { LineChartRef, LineChartWithRef } from "@/components/LineChart";
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
import { useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { columns } from "./column";
import { DataTable } from "./data-table";
import { ResponseUser } from "@/types/user";
import PaginationCustom from "@/components/PaginationCustom";
import { Download } from "lucide-react";
import axios from "axios";
import { format } from "date-fns";
import SendIcon from "@/assets/sendicon";
import UserIcon from "@/assets/usericon";
import VisiterIcon from "@/assets/visitericon";
import DatePicker, { DateValueType } from "react-tailwindcss-datepicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

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
      <SelectTrigger className="w-[330px] bg-[#B28A4C33] text-[#666666]">
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

interface CheckboxLabelProps {
  label: string;
  value: string;
  selectedValue: string;
  setSelectedValue: (value: string) => void;
}

const CheckboxLabel: React.FC<CheckboxLabelProps> = ({
  label,
  value,
  selectedValue,
  setSelectedValue,
}) => {
  return (
    <label className="label cursor-pointer justify-normal gap-4">
      <input
        type="checkbox"
        checked={selectedValue === value}
        onChange={() => setSelectedValue(value)}
        className="checkbox border-[#D4D4D4] checked:border-[#B28A4C] [--chkbg:#B28A4C] [--chkfg:white]"
      />
      <span className="label-text">{label}</span>
    </label>
  );
};

const DashboardPage = () => {
  const [selectedDevice, setSelectedDevice] = useState("0");
  const [timePeriod, setTimePeriod] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });

  const { data } = useSWR<ResponseDevice>(
    "https://api-beacon.adcm.co.th/api/device?limit=9999",
    fetcher
  );

  const { data: overview, isLoading } = useSWR<ResponseOverview>(
    selectedDevice === "0"
      ? `https://api-beacon.adcm.co.th/api/overview?${
          timePeriod?.startDate && timePeriod?.endDate
            ? `start_date=${timePeriod.startDate}&end_date=${timePeriod.endDate}`
            : ""
        }`
      : `https://api-beacon.adcm.co.th/api/overview/${selectedDevice}?${
          timePeriod?.startDate && timePeriod?.endDate
            ? `start_date=${timePeriod.startDate}&end_date=${timePeriod.endDate}`
            : ""
        }`,
    fetcher
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedImportType, setSelectedImportType] = useState("");

  const { data: user, isLoading: userLoading } = useSWR<ResponseUser>(
    selectedDevice === "0"
      ? `https://api-beacon.adcm.co.th/api/overview/user/all-user?limit=5&page=${currentPage}&${
          timePeriod?.startDate && timePeriod?.endDate
            ? `start_date=${timePeriod.startDate}&end_date=${timePeriod.endDate}`
            : ""
        }`
      : `https://api-beacon.adcm.co.th/api/overview/user/all-user/${selectedDevice}?limit=5&page=${currentPage}&${
          timePeriod?.startDate && timePeriod?.endDate
            ? `start_date=${timePeriod.startDate}&end_date=${timePeriod.endDate}`
            : ""
        }`,
    fetcher
  );

  const handleValueChange = (newValue: DateValueType) => {
    console.log("newValue:", newValue);
    setTimePeriod(newValue);
  };

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

  const exportData = useCallback(async () => {
    if (selectedImportType === "graph") {
      handleExportChartToImage();
      return;
    }

    await axios
      .get(`https://api-beacon.adcm.co.th/api/export/` + selectedImportType, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        responseType: "blob",
      })
      .then((response) => {
        const href = window.URL.createObjectURL(response.data);

        const anchorElement = document.createElement("a");

        anchorElement.href = href;
        anchorElement.download = `${format(
          new Date(),
          "dd/MM/yyyy"
        )}_${selectedImportType}`;
        document.body.appendChild(anchorElement);
        anchorElement.click();

        document.body.removeChild(anchorElement);
        window.URL.revokeObjectURL(href);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectedImportType]);

  const chartRef = useRef<LineChartRef>(null);
  const handleExportChartToImage = () => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const canvas = chart?.toBase64Image();
      if (canvas) {
        const link = document.createElement("a");
        link.href = canvas;
        link.download = "chart.png";
        link.click();
      }
    }
  };

  return (
    <div className="flex flex-col ">
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-full flex justify-between items-center">
          <h1 className="text-5xl font-bold text-[rgb(178,138,76)] mb-2">
            หน้าหลัก
          </h1>
          <Popover
            onOpenChange={(open) => {
              if (!open) {
                setSelectedImportType("");
              }
            }}
          >
            <PopoverTrigger asChild>
              <Button
                className="m-1 btn outline-none bg-[#B28A4C] btn-sm  text-white
                hover:bg-[#B28A4C]/80"
                size={"sm"}
                variant={"default"}
              >
                <Download /> ส่งออกข้อมูล
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-52  p-1" align="end">
              <div className="form-control">
                <CheckboxLabel
                  label="ผู้ใช้"
                  value="user"
                  selectedValue={selectedImportType}
                  setSelectedValue={setSelectedImportType}
                />
              </div>
              <div className="form-control">
                <CheckboxLabel
                  label="ข้อความ"
                  value="message"
                  selectedValue={selectedImportType}
                  setSelectedValue={setSelectedImportType}
                />
              </div>
              <div className="form-control">
                <CheckboxLabel
                  label="อุปกรณ์"
                  value="device"
                  selectedValue={selectedImportType}
                  setSelectedValue={setSelectedImportType}
                />
              </div>
              <div className="form-control">
                <CheckboxLabel
                  label="กราฟ"
                  value="graph"
                  selectedValue={selectedImportType}
                  setSelectedValue={setSelectedImportType}
                />
              </div>
              <hr />
              <div className="flex justify-center p-2">
                <button
                  onClick={exportData}
                  className="btn outline-none btn-sm btn-primary text-white flex items-center justify-center"
                >
                  ยืนยันการส่งออกข้อมูล
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-2xl text-[#666666]">ประสิทธิภาพของเนื้อหา</h2>

        <div className="flex items-center gap-2 ">
          <DatePicker
            separator={"-"}
            i18n="th"
            primaryColor="amber"
            value={timePeriod}
            onChange={handleValueChange}
            classNames={{
              input() {
                return " border text-[#666666] w-full p-2 rounded";
              },
            }}
            displayFormat="DD/MM/YYYY"
            placeholder="เลือกช่วงเวลา"
          />

          <SelectDevice
            devices={data?.response_data.data ?? []}
            handleSelect={(value) => {
              setSelectedDevice(value);
            }}
          />
        </div>
      </div>

      <div className="grid  gap-3 my-5 xl:grid-cols-3">
        <SummaryBox
          label="จำนวนข้อความที่ส่ง"
          value={overview?.response_data.data.card.message_count ?? 0}
          circleColor="bg-[#48DAA5]"
          textLabelColor="text-[#48DAA5]"
          icon={<SendIcon />}
        />

        <SummaryBox
          label="จำนวนผู้ใช้"
          value={overview?.response_data.data.card.user_count ?? 0}
          textLabelColor="text-[#EB96E7] "
          circleColor="bg-[#EB96E7]"
          icon={<UserIcon />}
        />
        <SummaryBox
          label="จำนวนครั้งที่ผู้ใช้เข้ามาในบีคอน"
          value={overview?.response_data.data.card.visit_count ?? 0}
          textLabelColor="text-[#285FCA]"
          circleColor="bg-[#285FCA]"
          icon={<VisiterIcon />}
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
            <LineChartWithRef
              ref={chartRef}
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

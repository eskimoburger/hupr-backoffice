import { baseURL, fetcher } from "@/api";
import RadioGroup from "@/components/RadioGroup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FrequencyItem, ResponseFrequency } from "@/types/frequency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { ResponseDevice } from "@/types/device";
import { FancyMultiSelect } from "@/components/MutiSelect";

const SelectFrequency = ({
  frequencies,
  handleSelect,
}: {
  frequencies: FrequencyItem[];
  handleSelect?: (value: string) => void;
}) => {
  const [selected, setSelected] = useState("");

  return (
    <Select
      value={selected}
      onValueChange={(value) => {
        setSelected(value);
        handleSelect?.(value);
      }}
    >
      <SelectTrigger className="">
        <SelectValue placeholder="เลือกความถี่" />
      </SelectTrigger>
      <SelectContent>
        {/* <SelectItem value="0">ทั้งหมด</SelectItem> */}
        {frequencies.map((frequency) => (
          <SelectItem value={frequency.uuid} key={frequency.uuid}>
            {frequency.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const CreateContent: React.FC = () => {
  const { data: frequencies } = useSWR<ResponseFrequency>(
    "https://api-beacon.adcm.co.th/api/receiving_freq",
    fetcher
  );
  const { data: devices } = useSWR<ResponseDevice>(
    "https://api-beacon.adcm.co.th/api/device?limit=9999",
    fetcher
  );

  console.log(devices);
  const [contentType, setContentType] = useState("text");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const inputImageRef = useRef<HTMLInputElement>(null);
  const inputVideoRef = useRef<HTMLInputElement>(null);
  const contentOptions = [
    {
      value: "text",
      label: "ข้อความ",
    },
    {
      value: "image",
      label: "รูปภาพ",
    },
    {
      value: "video",
      label: "วิดีโอ",
    },
    {
      value: "link",
      label: "ลิงค์",
    },
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;
    const formData = new FormData();
    formData.append("media", file as Blob);
    const response = await axios.post(
      "https://api-beacon.adcm.co.th/api/media/upload",
      formData
    );
    console.log(response.data.response_data.data.original);
    setImageSrc(baseURL + response.data.response_data.data.original);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;
    const formData = new FormData();
    formData.append("media", file as Blob);
    const response = await axios.post(
      "https://api-beacon.adcm.co.th/api/media/upload",
      formData
    );
    console.log(response.data.response_data.data.original);
    setVideoSrc(baseURL + response.data.response_data.data.original);
  };

  const renderValueContent = (value: string) => {
    switch (value) {
      case "text":
        return (
          <div className=" w-full  items-center gap-1.5 mt-2">
            <Label htmlFor="message" className="text-base">
              <span>ข้อความ</span>
            </Label>
            <Textarea
              className="active:outline-none"
              placeholder="พิมพ์ข้อความของคุณที่นี่"
              id="message"
              rows={6}
            />
          </div>
        );
      case "image":
        return (
          <div className=" w-full  items-center gap-1.5 mt-2">
            <Label htmlFor="uploadImage" className="text-base">
              <span>อัปโหลดรูปภาพของคุณ</span>
            </Label>
            <Input
              ref={inputImageRef}
              onChange={handleImageUpload}
              type="file"
              id="uploadImage"
              accept="image/*"
            />
            {imageSrc && (
              <img
                src={imageSrc}
                alt="preview"
                className="w-32 h-32 mt-2 rounded-md"
              />
            )}
          </div>
        );
      case "video":
        return (
          <div className=" w-full  items-center gap-1.5 mt-2">
            <Label htmlFor="video" className="text-base">
              <span>อัปโหลดวิดีโอของคุณ</span>
            </Label>
            <Input
              ref={inputVideoRef}
              type="file"
              id="video"
              accept="video/mp4"
              onChange={handleVideoUpload}
            />
            {videoSrc && (
              <video controls className="w-32 h-32 mt-2 rounded-md">
                <source src={videoSrc} type="video/mp4" />
                <track kind="captions" />
              </video>
            )}
          </div>
        );

      case "link":
        return "ลิงค์";
      default:
        return "ข้อความ";
    }
  };

  useEffect(() => {
    // clear value in input when change content type
    if (inputImageRef.current) inputImageRef.current.value = "";
    if (inputVideoRef.current) inputVideoRef.current.value = "";
    setImageSrc(null);
    setVideoSrc(null);
  }, [contentType]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#B28A4C] mb-2 ">สร้างคอนเทนต์</h1>
      <div className=" w-full items-center gap-1.5">
        <Label htmlFor="contentName">
          <span>ชื่อคอนเทนต์</span>
        </Label>
        <Input type="text" id="contentName" placeholder=" ชื่อคอนเทนต์" />
      </div>
      <div className="my-2" />
      <Label htmlFor="contentDescription" className="">
        <span>คำอธิบาย</span>
      </Label>
      {/* <h1 className="">ข้อความ</h1> */}
      <div className="mt-2 bg-[#B28A4C33] p-4 rounded-md grid grid-cols-2 gap-2">
        <div>
          <RadioGroup
            name="content-type"
            options={contentOptions}
            onChange={(value) => setContentType(value)}
            selectedValue={contentType}
          />
          {renderValueContent(contentType)}
        </div>
      </div>
      <div className="my-2" />
      <Label htmlFor="contentPeriod">
        <span>ระยะเวลาเนื้อหา</span>
      </Label>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <fieldset>
          <legend className="text-sm">วันที่เริ่มต้น</legend>
          <input
            className="input input-bordered input-sm  w-full"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            placeholder="เลือกวันที่เริ่มต้น"
          />
        </fieldset>
        <fieldset>
          <legend className="text-sm">เวลาที่เริ่มต้น</legend>
          <input
            className="input input-bordered input-sm  w-full"
            type="time"
          />
        </fieldset>
        <fieldset>
          <legend className="text-sm">วันที่สิ้นสุด</legend>
          <input
            className="input input-bordered input-sm  w-full"
            type="date"
            min={new Date().toISOString().split("T")[0]}
          />
        </fieldset>
        <fieldset>
          <legend className="text-sm">เวลาที่สิ้นสุด</legend>
          <input
            className="input input-bordered input-sm  w-full"
            type="time"
          />
        </fieldset>
        <div className=" flex gap-2">
          <div className="flex items-center gap-2">
            <input
              className="radio radio-primary radio-sm"
              type="radio"
              id="always"
              name="period"
              value="always"
              checked
            />
            <label className="label-text" htmlFor="always">
              Always
            </label>
          </div>
          <div className="flex items-center gap-4">
            <input
              className="radio radio-primary radio-sm"
              type="radio"
              id="specific"
              name="period"
              value="Specific Time"
              checked
            />
            <label className="label-text" htmlFor="specific">
              Specific Time
            </label>
          </div>
        </div>
        <div />
        <div>
          <Label className="label-text">
            <span>ความถี่ในการรับ</span>
          </Label>
          <SelectFrequency
            frequencies={frequencies?.response_data.data ?? []}
            handleSelect={(value) => {
              console.log(value);
            }}
          />
        </div>
        <div />
        <div>
          <Label className="label-text">
            <span>เลือกสถานที่</span>
          </Label>
          <FancyMultiSelect />
        </div>
      </div>
    </div>
  );
};

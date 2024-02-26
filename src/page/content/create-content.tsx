import RadioGroup from "@/components/RadioGroup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useState } from "react";

export const CreateContent: React.FC = () => {
  const [contentType, setContentType] = useState("text");
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
    formData.append("file", file as Blob);
    const response = await axios.post(
      "https://api-beacon.adcm.co.th/api/media/upload",
      formData
    );
    console.log(response);
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
              onChange={handleImageUpload}
              type="file"
              id="uploadImage"
              accept="image/*"
            />
          </div>
        );
      case "video":
        return "วิดีโอ";
      case "link":
        return "ลิงค์";
      default:
        return "ข้อความ";
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#B28A4C] mb-2 ">สร้างคอนเทนต์</h1>

      <div className=" w-full  items-center gap-1.5">
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
      <div className="mt-2 bg-[#B28A4C33] p-4 rounded-md">
        <RadioGroup
          name="content-type"
          options={contentOptions}
          onChange={(value) => setContentType(value)}
          selectedValue={contentType}
        />
        {renderValueContent(contentType)}
      </div>
    </div>
  );
};

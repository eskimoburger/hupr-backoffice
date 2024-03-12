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
import React, { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { ResponseDevice } from "@/types/device";
import { FancyMultiSelect, Framework } from "@/components/MutiSelect";
import { Checkbox } from "@/components/ui/checkbox";

import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { add, parseISO } from "date-fns";

export const contentOptions = [
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
    value: "template",
    label: "ลิงค์",
  },
];
export interface Content {
  type: "text" | "image" | "video" | "template";
  text?: string;
  originalContentUrl?: string;
  previewImageUrl?: string;
  altText?: string;
  template?: {
    type: string;
    columns: {
      imageUrl: string;
      action: {
        type: string;
        uri: string;
      };
    }[];
  };
}

export const SelectFrequency = ({
  value,
  frequencies,
  handleSelect,
  isDisabled,
}: {
  value?: string;
  frequencies: FrequencyItem[];
  handleSelect?: (value: string) => void;
  isDisabled?: boolean;
}) => {
  const [selected, setSelected] = useState("");

  useEffect(() => {
    setSelected(value ?? "");
  }, [value]);

  return (
    <Select
      disabled={isDisabled}
      value={selected}
      onValueChange={(value) => {
        setSelected(value);
        handleSelect?.(value);
      }}
    >
      <SelectTrigger
        className="
       disabled:border-gray-300 disabled:text-black disabled:opacity-100"
      >
        <SelectValue placeholder="เลือกความถี่" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="0">ทดสอบ</SelectItem>
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
  const navigate = useNavigate();
  const contentNameRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("");
  const [count, setCount] = useState(0);
  const [checkedAllDevices, setCheckedAllDevices] = useState(false);
  const { data: frequencies } = useSWR<ResponseFrequency>(
    "https://api-beacon.adcm.co.th/api/receiving_freq",
    fetcher
  );
  const { data: devices } = useSWR<ResponseDevice>(
    "https://api-beacon.adcm.co.th/api/device?limit=9999",
    fetcher,
    {}
  );

  const modifiedDevices = devices
    ? devices.response_data.data.map((device) => ({
        label: device.name,
        value: device.uuid,
      }))
    : [];

  const handleCreateContent = async () => {
    const campaign_name = contentNameRef.current?.value;
    const startDate = startDateRef.current?.value;
    const startTime = startTimeRef.current?.value;
    const endDate = endDateRef.current?.value;
    const endTime = endTimeRef.current?.value;

    const devices = selectedDevices;

    const selectedFrequency = frequency;

    if (!campaign_name || !startDate || !startTime || !endDate || !endTime) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    if (devices.length === 0) {
      toast.error("กรุณาเลือกอุปกรณ์");
      return;
    }
    if (selectedFrequency.length === 0) {
      toast.error("กรุณาเลือกความถี่ในการรับ");
      return;
    }

    const messageCondition: Content[] = [];

    for (const content of contentTypes) {
      switch (content.type) {
        case "text":
          if (!content.text || content.text === "") {
            toast.error("กรุณากรอกข้อความ");
            return;
          }
          messageCondition.push({
            type: content.type,
            text: content.text,
          });
          break;
        case "image":
        case "video":
          if (
            !content.originalContentUrl ||
            !content.previewImageUrl ||
            content.originalContentUrl === "" ||
            content.previewImageUrl === ""
          ) {
            toast.error("กรุณาเพิ่มวิดีโอหรือรูปภาพ");
            return;
          }
          messageCondition.push({
            type: content.type,
            originalContentUrl: content.originalContentUrl,
            previewImageUrl: content.previewImageUrl,
          });
          break;
        case "template":
          if (!content.altText || !content.template) {
            toast.error("กรุณากรอกข้อความและลิงค์");
            return;
          }
          if (!content.template.columns[0].imageUrl) {
            toast.error("กรุณาเพิ่มรูปภาพ");
            return;
          }
          messageCondition.push({
            type: content.type,
            altText: content.altText,
            template: content.template,
          });
          break;
      }
    }

    const startDateTime = `${startDate}T${startTime}`;
    const endDateTime = `${endDate}T${endTime}`;

    const utc7StartDate = add(parseISO(startDateTime), {
      hours: 7,
    }).toISOString();
    const utc7EndDate = add(parseISO(endDateTime), { hours: 7 }).toISOString();

    toast.promise(
      axios.post(
        "https://api-beacon.adcm.co.th/api/message",
        {
          campaign_name,
          start_datetime: count >= 9 ? null : utc7StartDate,
          end_datetime: count >= 9 ? null : utc7EndDate,
          recieving_freq_uuid:
            selectedFrequency === "0" ? null : selectedFrequency,
          beacon_action: "enter",
          device_uuid: devices,
          message: messageCondition,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ),
      {
        loading: "กำลังสร้างสื่อ",
        success: () => {
          navigate("/content");
          return "สร้างสื่อสำเร็จ";
        },
        error: (err) => {
          console.log(err.response.status);

          if (err.response.status === 401) {
            return "คุณไม่มีสิทธิ์ในการสร้างสื่อ";
          } else if (err.response.status === 400) {
            return "กรุณากรอกข้อมูลให้ครบถ้วน";
          }
          return "เกิดข้อผิดพลาดในการสร้างสื่อ";
        },
      }
    );
  };

  const handleSelectedChange = React.useCallback((selected: Framework[]) => {
    setSelectedDevices(selected.map((device) => device.value));
  }, []);

  const [contentTypes, setContentTypes] = useState<Content[]>([
    {
      type: "text",
    },
  ]);

  const setContentTypeAtIndex = (index: number, type: Content["type"]) => {
    setContentTypes((prevContentTypes) => {
      const newContentTypes = [...prevContentTypes];
      newContentTypes[index].type = type;

      console.log(newContentTypes);

      if (type === "text") {
        newContentTypes[index].text = contentTypes[index]?.text ?? "";
      } else if (type === "image" || type === "video") {
        newContentTypes[index].originalContentUrl = "";
        newContentTypes[index].previewImageUrl = "";
      } else if (type === "template") {
        newContentTypes[index].template = {
          type: "image_carousel",
          columns: [
            {
              imageUrl: "",
              action: {
                type: "uri",
                uri: "",
              },
            },
          ],
        };
      }

      return newContentTypes;
    });
  };

  const handleImageUploadAtIndex = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;
    const formData = new FormData();
    formData.append("media", file as Blob);
    const response = await axios.post(
      "https://api-beacon.adcm.co.th/api/media/upload",
      formData
    );
    setContentTypes((prevContentTypes) => {
      const newContentTypes = [...prevContentTypes];
      newContentTypes[index].originalContentUrl =
        baseURL + response.data.response_data.data.original;
      newContentTypes[index].previewImageUrl =
        baseURL + response.data.response_data.data.original;
      return newContentTypes;
    });
  };

  const handleVideoUploadAtIndex = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;
    const formData = new FormData();
    formData.append("media", file as Blob);
    const response = await axios.post(
      "https://api-beacon.adcm.co.th/api/media/upload",
      formData
    );
    setContentTypes((prevContentTypes) => {
      const newContentTypes = [...prevContentTypes];
      newContentTypes[index].originalContentUrl =
        baseURL + response.data.response_data.data.original;
      newContentTypes[index].previewImageUrl =
        baseURL + response.data.response_data.data.original;
      return newContentTypes;
    });
  };

  const handleTemplateUploadAtIndex = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;
    const formData = new FormData();
    formData.append("media", file as Blob);
    const response = await axios.post(
      "https://api-beacon.adcm.co.th/api/media/upload",
      formData
    );
    setContentTypes((prevContentTypes) => {
      const newContentTypes = [...prevContentTypes];
      newContentTypes[index].template!.columns[0].imageUrl =
        baseURL + response.data.response_data.data.original;
      return newContentTypes;
    });
  };

  const renderValueContentNew = (index: number) => {
    const value = contentTypes[index];
    switch (value.type) {
      case "text":
        return (
          <div className=" w-full  items-center gap-1.5 mt-2">
            <Label htmlFor={`message-${index}`} className="text-base">
              <span>ข้อความ</span>
            </Label>
            <Textarea
              value={value.text}
              onChange={(e) => {
                setContentTypes((prevContentTypes) => {
                  const newContentTypes = [...prevContentTypes];
                  newContentTypes[index].text = e.target.value;
                  return newContentTypes;
                });
              }}
              className="active:outline-none"
              placeholder="พิมพ์ข้อความของคุณที่นี่"
              id={`message-${index}`}
              rows={6}
            />
          </div>
        );
      case "image":
        return (
          <div className=" w-full  items-center gap-1.5 mt-2">
            <Label htmlFor={`uploadImage-${index}`} className="text-base">
              <span>อัปโหลดรูปภาพของคุณ</span>
            </Label>
            <Input
              onChange={(e) => {
                handleImageUploadAtIndex(index, e);
              }}
              type="file"
              id={`uploadImage-${index}`}
              accept="image/*"
            />
            {value.originalContentUrl && (
              <img
                src={value.originalContentUrl}
                alt="preview"
                className="w-32 h-32 mt-2 rounded-md"
              />
            )}
          </div>
        );
      case "video":
        return (
          <div className=" w-full  items-center gap-1.5 mt-2">
            <Label htmlFor={`video-${index}`} className="text-base">
              <span>อัปโหลดวิดีโอของคุณ</span>
            </Label>
            <Input
              onChange={(e) => {
                handleVideoUploadAtIndex(index, e);
              }}
              type="file"
              id={`video-${index}`}
              accept="video/mp4"
            />
            {value.originalContentUrl && (
              <video controls className="w-32 h-32 mt-2 rounded-md">
                <source src={value.originalContentUrl} type="video/mp4" />
                <track kind="captions" />
              </video>
            )}
          </div>
        );

      case "template":
        return (
          <div className=" w-full  items-center gap-1.5 mt-2">
            <Label htmlFor={`uploadImage-${index}`} className="text-base">
              <span>อัปโหลดรูปภาพของคุณ</span>
            </Label>
            <Input
              onChange={(e) => {
                handleTemplateUploadAtIndex(index, e);
              }}
              type="file"
              id={`uploadImage-${index}`}
              accept="image/*"
            />
            {value.template?.columns[0].imageUrl && (
              <img
                src={value.template?.columns[0].imageUrl}
                alt="preview"
                className="w-32 h-32 mt-2 rounded-md"
              />
            )}
          </div>
        );
      default:
        return "ข้อความ";
    }
  };
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#B28A4C] mb-2 ">สร้างสื่อใหม่</h1>
      <div className=" w-full items-center gap-1.5">
        <Label htmlFor="contentName">
          <span>ชื่อสื่อที่จะสร้าง</span>
        </Label>
        <Input
          ref={contentNameRef}
          type="text"
          id="contentName"
          placeholder=" ชื่อคอนเทนต์"
        />
      </div>
      <div className="my-2" />
      <Label htmlFor="contentDescription" className="">
        <span>ข้อความ</span>
      </Label>
      {contentTypes.map((_, index) => (
        <div
          key={index}
          className="mt-2 bg-[#B28A4C33] p-4 rounded-md grid grid-cols-2 gap-6 "
        >
          <div>
            <RadioGroup
              name={`content-type-${index}`}
              options={contentOptions}
              onChange={(value) => {
                const contentType = value as
                  | "text"
                  | "image"
                  | "video"
                  | "template";
                setContentTypeAtIndex(index, contentType);
              }}
              selectedValue={contentTypes[index].type}
            />
            {renderValueContentNew(index)}
            <div className="flex justify-end mt-1">
              <button
                disabled={contentTypes.length <= 1}
                onClick={() => {
                  setContentTypes((prevContentTypes) => {
                    const newContentTypes = [...prevContentTypes];
                    newContentTypes.splice(index, 1);
                    return newContentTypes;
                  });
                }}
                className="btn btn-error w-[120px] btn-sm text-base text-white mt-2 flex items-center justify-center"
              >
                ลบ
              </button>
            </div>
          </div>
          {contentTypes[index].type === "template" && (
            <div className="self-center">
              <Label htmlFor="altText">
                <span>ข้อความแนบลิงค์</span>
              </Label>
              <Input
                value={contentTypes[index]?.altText ?? ""}
                onChange={(e) => {
                  setContentTypes((prevContentTypes) => {
                    const newContentTypes = [...prevContentTypes];
                    newContentTypes[index].altText = e.target.value;
                    return newContentTypes;
                  });
                }}
                type="text"
                id="altText"
                placeholder=" ข้อความแนบลิงค์"
              />
              <Label htmlFor="link">
                <span>ลิงค์</span>
              </Label>
              <Input
                value={
                  contentTypes[index]?.template?.columns?.[0]?.action?.uri ?? ""
                }
                type="text"
                id={`link-${index}`}
                placeholder=" ลิงค์"
                onChange={(e) => {
                  setContentTypes((prevContentTypes) => {
                    const newContentTypes = [...prevContentTypes];
                    newContentTypes[index].template!.columns[0].action.uri =
                      e.target.value;
                    return newContentTypes;
                  });
                }}
              />
            </div>
          )}
        </div>
      ))}
      <button
        disabled={contentTypes.length >= 5}
        onClick={() => {
          setContentTypes((prevContentTypes) => [
            ...prevContentTypes,
            { type: "text" },
          ]);
        }}
        className="btn btn-primary w-[120px] btn-sm text-base text-white mt-2 flex items-center justify-center"
      >
        <Plus size={18} /> เพิ่ม
      </button>
      <div className="my-2" />
      <Label
        htmlFor="contentPeriod"
        onClick={() => {
          setCount((prev) => prev + 1);
        }}
      >
        <span>ระยะเวลาที่ต้องการส่ง</span>
      </Label>
      {count >= 9 && (
        <div>
          <button
            onClick={() => {
              setCount(0);
            }}
          >
            เทพเจ้าแห่งกาลเวลา
          </button>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 mt-2">
        <fieldset>
          <legend className="text-sm">วันที่เริ่มต้น</legend>
          <input
            ref={startDateRef}
            onFocus={() => {
              if (startDateRef.current) startDateRef.current.type = "date";
            }}
            onBlur={() => {
              if (startDateRef.current) startDateRef.current.type = "text";
            }}
            className="input input-bordered input-sm  w-full"
            type="text"
            min={new Date().toISOString().split("T")[0]}
            placeholder="เลือกวันที่เริ่มต้น"
          />
        </fieldset>
        <fieldset>
          <legend className="text-sm">เวลาที่เริ่มต้น</legend>
          <input
            ref={startTimeRef}
            onFocus={() => {
              if (startTimeRef.current) startTimeRef.current.type = "time";
            }}
            onBlur={() => {
              if (startTimeRef.current) startTimeRef.current.type = "text";
            }}
            className="input input-bordered input-sm  w-full"
            placeholder="เลือกเวลาที่เริ่มต้น"
            type="text"
          />
        </fieldset>
        <fieldset>
          <legend className="text-sm">วันที่สิ้นสุด</legend>
          <input
            onFocus={() => {
              if (endDateRef.current) endDateRef.current.type = "date";
            }}
            onBlur={() => {
              if (endDateRef.current) endDateRef.current.type = "text";
            }}
            placeholder="เลือกวันที่สิ้นสุด"
            ref={endDateRef}
            className="input input-bordered input-sm  w-full"
            type="text"
            min={new Date().toISOString().split("T")[0]}
          />
        </fieldset>
        <fieldset>
          <legend className="text-sm">เวลาที่สิ้นสุด</legend>
          <input
            onFocus={() => {
              if (endTimeRef.current) endTimeRef.current.type = "time";
            }}
            onBlur={() => {
              if (endTimeRef.current) endTimeRef.current.type = "text";
            }}
            placeholder="เลือกเวลาที่สิ้นสุด"
            ref={endTimeRef}
            className="input input-bordered input-sm  w-full"
            type="text"
          />
        </fieldset>

        <div>
          <Label className="label-text">
            <span>ความถี่ในการรับ</span>
          </Label>
          <SelectFrequency
            frequencies={frequencies?.response_data.data ?? []}
            handleSelect={(value) => {
              setFrequency(value);
            }}
          />
        </div>
        <div />
        <div>
          <Label className="label-text">
            <span>เลือกสถานที่</span>
          </Label>

          <FancyMultiSelect
            options={modifiedDevices}
            selectedAll={checkedAllDevices}
            onSelectedChange={handleSelectedChange}
          />
        </div>
        <div>
          <Label className="label-text">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="all-devices"
                onCheckedChange={(checked) => {
                  setCheckedAllDevices(checked as boolean);
                }}
              />
              <label
                htmlFor="all-devices"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                อุปกรณ์ทุกตัว
              </label>
            </div>
          </Label>
        </div>
      </div>
      <br />
      <button
        onClick={handleCreateContent}
        className="btn outline-none btn-sm  btn-primary text-white flex items-center"
      >
        เริ่มสร้าง
      </button>
    </div>
  );
};

import { baseURL, fetcher } from "@/api";
import RadioGroup from "@/components/RadioGroup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResponseContent } from "@/types/content";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { Content, SelectFrequency, contentOptions } from "./create-content";
import { useEffect, useMemo, useRef, useState } from "react";

import { ResponseFrequency } from "@/types/frequency";
import { Device, ResponseDevice } from "@/types/device";
import { Textarea } from "@/components/ui/textarea";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { add, parseISO } from "date-fns";

const ContentDetail = () => {
  const { id } = useParams();
  const { data } = useSWR<ResponseContent>(`${baseURL}/message/${id}`, {
    fetcher,
  });

  const contentNameRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);

  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("");
  const [contentTypes, setContentTypes] = useState<Content[]>([
    {
      type: "text",
    },
  ]);

  const { data: frequencies } = useSWR<ResponseFrequency>(
    "https://api-beacon.adcm.co.th/api/receiving_freq",
    fetcher
  );
  const { data: devices } = useSWR<ResponseDevice>(
    "https://api-beacon.adcm.co.th/api/device?limit=9999",
    fetcher,
    {}
  );

  const modifiedDevices = useMemo(() => {
    return devices
      ? devices.response_data.data.map((device) => ({
          label: device.name,
          value: device.uuid,
        }))
      : [];
  }, [devices]);

  useEffect(() => {
    if (data) {
      contentNameRef.current!.value = data.response_data.data.campaign_name;
      const messageConfig = data.response_data.data.message_config;
      const startDate = add(
        parseISO(messageConfig.start_datetime ?? new Date().toISOString()),
        {
          hours: 0,
        }
      ).toISOString();
      const endDate = add(
        parseISO(messageConfig.end_datetime ?? new Date().toISOString()),
        {
          hours: 0,
        }
      ).toISOString();

      startDateRef.current!.value = startDate.split("T")[0];
      startTimeRef.current!.value = startDate.split("T")[1].split(".")[0];
      endDateRef.current!.value = endDate.split("T")[0];
      endTimeRef.current!.value = endDate.split("T")[1].split(".")[0];

      const messages = data.response_data.data.message;
      setFrequency(messageConfig.recieving_freq_uuid);
      setSelectedDevices(messageConfig.device_uuid);
      setContentTypes(
        messages.map((message) => {
          if (!message) {
            return { type: "text", text: "" };
          }

          if (message.type === "text") {
            return { type: "text", text: message.text };
          } else if (message.type === "image") {
            return {
              type: "image",
              originalContentUrl: message.originalContentUrl,
              previewImageUrl: message.previewImageUrl,
            };
          } else if (message.type === "video") {
            return {
              type: "video",
              originalContentUrl: message.originalContentUrl,
              previewImageUrl: message.previewImageUrl,
            };
          } else {
            return {
              type: "template",
              altText: message.altText,
              template: message.template,
            };
          }
        })
      );
    }
  }, [data]);

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
              readOnly
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
            {value.originalContentUrl && (
              <img
                src={value.originalContentUrl}
                alt="preview"
                className="mt-2"
              />
            )}
          </div>
        );
      case "video":
        return (
          <div className=" w-full  items-center gap-1.5 mt-2">
            {value.originalContentUrl && (
              <video controls className="mt-2 rounded-md">
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
              readOnly
              type="file"
              id={`uploadImage-${index}`}
              accept="image/*"
            />
            {value.template?.columns?.[0]?.imageUrl && (
              <img
                src={value.template?.columns?.[0]?.imageUrl}
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
      <h1 className="text-3xl font-bold text-[#B28A4C] mb-2 ">
        รายละเอียดสื่อ
      </h1>
      <div className=" w-full items-center gap-1.5">
        <Label htmlFor="contentName">
          <span>ชื่อคอนเทนต์</span>
        </Label>
        <Input
          readOnly
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
              onChange={() => {}}
              selectedValue={contentTypes[index].type}
            />
            {renderValueContentNew(index)}
          </div>
          {contentTypes[index].type === "template" && (
            <div className="self-center">
              <Label htmlFor="altText">
                <span>ข้อความแนบลิงค์</span>
              </Label>
              <Input
                value={contentTypes[index]?.altText ?? ""}
                readOnly
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

      <div className="my-2" />
      <Label htmlFor="contentPeriod">
        <span>ระยะเวลาที่ต้องการส่ง</span>
      </Label>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <fieldset>
          <legend className="text-sm">วันที่เริ่มต้น</legend>
          <input
            readOnly
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
            readOnly
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
            readOnly
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
            readOnly
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
        <div />
        <div />
        <div>
          <Label className="label-text">
            <span>ความถี่ในการรับ</span>
          </Label>
          <SelectFrequency
            isDisabled
            value={frequency}
            frequencies={frequencies?.response_data.data ?? []}
          />
        </div>
        <div />
        <div>
          <Label className="label-text">
            <span>เลือกสถานที่</span>
          </Label>
          <AsyncSelect
            isMulti
            cacheOptions
            defaultOptions
            isClearable={false}
            placeholder="เลือกสถานที่"
            noOptionsMessage={() => "ไม่พบสถานที่"}
            value={modifiedDevices.filter((device) =>
              selectedDevices.includes(device.value)
            )}
            isDisabled
            menuPlacement="auto"
            loadOptions={(_, callBack) => {
              axios
                .get(`${baseURL}/device?limit=9999`, {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                })
                .then((response) => {
                  callBack(
                    response.data.response_data.data.map((device: Device) => ({
                      label: device.name,
                      value: device.uuid,
                    }))
                  );
                });
            }}
          />
        </div>
        <div />
      </div>
      <br />
    </div>
  );
};
export { ContentDetail };

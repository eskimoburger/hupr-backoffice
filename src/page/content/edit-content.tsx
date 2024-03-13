import { baseURL, fetcher } from "@/api";
import RadioGroup from "@/components/RadioGroup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResponseContent } from "@/types/content";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { Content, SelectFrequency, contentOptions } from "./create-content";
import { useEffect, useMemo, useRef, useState } from "react";
import { Framework } from "@/components/MutiSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { ResponseFrequency } from "@/types/frequency";
import { Plus } from "lucide-react";
import { Device, ResponseDevice } from "@/types/device";
import { Textarea } from "@/components/ui/textarea";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { add, parseISO } from "date-fns";
import toast from "react-hot-toast";
const EditContent = () => {
  const { id } = useParams();
  const { data } = useSWR<ResponseContent>(
    id ? `${baseURL}/message/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const navigate = useNavigate();

  const [count, setCount] = useState(0);

  const contentNameRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("");
  const [contentTypes, setContentTypes] = useState<Content[]>([
    { type: "text" },
  ]);
  const [, setCheckedAllDevices] = useState(false);
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
          hours: 7,
        }
      ).toISOString();
      const endDate = add(
        parseISO(messageConfig.end_datetime ?? new Date().toISOString()),
        {
          hours: 7,
        }
      ).toISOString();

      startDateRef.current!.value = startDate.split("T")[0];
      startTimeRef.current!.value = startDate.split("T")[1].split(".")[0];
      endDateRef.current!.value = endDate.split("T")[0];
      endTimeRef.current!.value = endDate.split("T")[1].split(".")[0];

      setFrequency(messageConfig.recieving_freq_uuid ?? "0");
      setSelectedDevices(messageConfig.device_uuid);
      // console.log(data.response_data.data.message);

      setContentTypes(
        data.response_data.data.message.map((message) => {
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
  const setContentTypeAtIndex = (index: number, type: Content["type"]) => {
    if (index < 0 || index >= contentTypes.length) {
      console.error("Index out of bounds");
      return;
    }
    setContentTypes((prevContentTypes) => {
      const newContentTypes = [...prevContentTypes];
      newContentTypes[index].type = type;
      if (type === "text") {
        newContentTypes[index].text = "";
      } else if (type === "image") {
        newContentTypes[index].originalContentUrl = "";
        newContentTypes[index].previewImageUrl = "";
      } else if (type === "video") {
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

  const handleEditContent = async () => {
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
      hours: 0,
    }).toISOString();
    const utc7EndDate = add(parseISO(endDateTime), { hours: 0 }).toISOString();

    toast.promise(
      axios.put(
        `https://api-beacon.adcm.co.th/api/message/${id}`,
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
        loading: "กำลังแก้ไขสื่อ...",
        success: () => {
          navigate("/content");
          return "แก้ไขสื่อสำเร็จ";
        },
        error: (err) => {
          console.log(err.response.status);

          if (err.response.status === 401) {
            return "กรุณาเข้าสู่ระบบก่อนทำการสร้างสื่อ";
          } else if (err.response.status === 400) {
            return "กรุณากรอกข้อมูลให้ครบถ้วน";
          }
          return "เกิดข้อผิดพลาดในการแก้ไขสื่อ";
        },
      }
    );
  };

  // const handleEditContent = async () => {
  //   const campaign_name = contentNameRef.current?.value;
  //   const startDate = startDateRef.current?.value;
  //   const startTime = startTimeRef.current?.value;
  //   const endDate = endDateRef.current?.value;
  //   const endTime = endTimeRef.current?.value;
  //   const messageCondition = contentTypes.map((content) => {
  //     switch (content.type) {
  //       case "text":
  //         return {
  //           type: content.type,
  //           text: content.text,
  //         };
  //       case "image":
  //       case "video":
  //         return {
  //           type: content.type,
  //           originalContentUrl: content.originalContentUrl,
  //           previewImageUrl: content.previewImageUrl,
  //         };
  //       case "template":
  //         return {
  //           type: content.type,
  //           altText: content.altText,
  //           template: content.template,
  //         };
  //     }
  //   });

  //   console.log({
  //     campaign_name,
  //     start_datetime: `${startDate}T${startTime}`,
  //     end_datetime: `${endDate}T${endTime}`,
  //     recieving_freq_uuid: frequency,
  //     beacon_action: "enter",
  //     device_uuid: selectedDevices,
  //     message: messageCondition,
  //   });

  //   const response = await axios.put(
  //     ` https://api-beacon.adcm.co.th/api/message/${id}`,
  //     {
  //       campaign_name,
  //       start_datetime: `${startDate}T${startTime}`,
  //       end_datetime: `${endDate}T${endTime}`,
  //       recieving_freq_uuid: frequency === "0" ? null : frequency,
  //       beacon_action: "enter",
  //       device_uuid: selectedDevices,
  //       message: messageCondition,
  //     },
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     }
  //   );
  //   console.log(response);
  //   // console.log(response);
  // };

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
      <h1 className="text-3xl font-bold text-[#B28A4C] mb-2 ">แก้ไขสื่อ</h1>
      <div className=" w-full items-center gap-1.5">
        <Label htmlFor="contentName">
          <span>ชื่อคอนเทนต์</span>
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

        <div />
        <div />
        <div>
          <Label className="label-text">
            <span>ความถี่ในการรับ</span>
          </Label>
          <SelectFrequency
            value={frequency}
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
            onChange={(selected) => {
              if (selected) {
                setSelectedDevices(
                  (selected as Framework[]).map((device) => device.value)
                );
              }
            }}
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
        <div>
          <Label className="label-text">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="all-devices"
                onCheckedChange={(checked) => {
                  setCheckedAllDevices(checked as boolean);
                  setSelectedDevices(
                    checked ? modifiedDevices.map((device) => device.value) : []
                  );
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
        onClick={handleEditContent}
        className="btn outline-none btn-sm  btn-primary text-white flex items-center"
      >
        บันทึก
      </button>
    </div>
  );
};
export { EditContent };

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import liff from "@line/liff";
import axios, { AxiosError } from "axios";

import { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const DialogNotMember: FC<{
  open: boolean;

  handleOpen?: () => void;

  profile?: {
    displayName: string;
    pictureUrl: string;
  };
}> = ({ open, profile, handleOpen }) => {
  return (
    <Dialog open={open}>
      <DialogContent className="text-center">
        {profile && (
          <div className="flex flex-col items-center">
            <img
              src={profile.pictureUrl}
              alt={profile.displayName}
              className="rounded-full w-20 h-20"
            />
            <h1 className="text-xl ">{profile.displayName}</h1>
          </div>
        )}

        <h1 className="text-2xl text-[#B28A4C] font-bold">
          คุณยังไม่ได้เป็นสมาชิก
        </h1>
        <h2 className="text-base font-light">
          โปรดลงทะเบียนเพื่อขออนุญาตการเข้าถึงข้อมูลหน้าเว็บ
        </h2>

        <DialogFooter className="flex-col sm:justify-center gap-1">
          <Button
            onClick={() => {
              handleOpen?.();
            }}
            size={"sm"}
            variant="default"
            className="bg-[#B28A4C] text-white hover:bg-[#9b6f3f] active:bg-[#7d5633]"
          >
            ลงทะเบียน
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
const DialogRegister: FC<{
  open: boolean;
  handleClose: (open: boolean) => void;
  picture?: string;
}> = ({ handleClose, open, picture }) => {
  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement>(null);
  const surnameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(`https://api-beacon.adcm.co.th/api/user`, {
        first_name: nameRef.current?.value,
        last_name: surnameRef.current?.value,
        email: emailRef.current?.value,
        picture,
        role: "admin",
        department_uuid: "dffdedd0-cbd4-11ee-8557-07e6505aa0d7",
      });
      if (res.status === 201) {
        handleClose(false);
        navigate("/wait");
      }
    } catch (err) {
      const e = err as AxiosError<{
        response_message: string;
      }>;
      alert(e.response?.data.response_message);
      navigate("/login");
    }
  };

  return (
    <Dialog open={open} modal onOpenChange={handleClose}>
      <DialogContent>
        <h1 className="text-2xl text-[#B28A4C] font-bold text-center">
          ลงทะเบียนสมาชิก
        </h1>
        <form
          id="register"
          className="flex flex-col gap-2"
          onSubmit={handleRegister}
        >
          <Label htmlFor="email" className="label-text">
            อีเมล
          </Label>
          <Input
            required
            ref={emailRef}
            id="email"
            type="email"
            placeholder=" กรุณากรอกอีเมล"
          />
          <Label htmlFor="name" className="label-text">
            ชื่อ
          </Label>
          <Input
            required
            ref={nameRef}
            id="name"
            type="text"
            placeholder=" กรุณากรอกชื่อ"
          />
          <Label htmlFor="surname" className="label-text">
            นามสกุล
          </Label>
          <Input
            required
            ref={surnameRef}
            id="surname"
            type="text"
            placeholder=" กรุณากรอกนามสกุล"
          />
        </form>

        <DialogFooter className="flex-col sm:justify-end gap-1">
          <Button
            type="submit"
            form="register"
            size={"sm"}
            variant="default"
            className="bg-[#B28A4C] text-white hover:bg-[#9b6f3f] active:bg-[#7d5633]"
          >
            ลงทะเบียน
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const NotMemberPage = () => {
  const [profile, setProfile] = useState<{
    displayName: string;
    pictureUrl: string;
  } | null>(null);

  const [openDialogNotMember, setOpenDialogNotMember] = useState(false);
  const [openDialogRegister, setOpenDialogRegister] = useState(false);

  const liffInit = async () => {
    try {
      await liff.init({ liffId: import.meta.env.VITE_LIFF_ID });
      if (liff.isLoggedIn()) {
        const profile = await liff.getProfile();

        setProfile(
          profile as {
            displayName: string;
            pictureUrl: string;
          }
        );
      } else {
        liff.login();
      }
    } catch {
      console.error("error");
    }
  };
  useEffect(() => {
    liffInit();
  }, []);

  useEffect(() => {
    if (profile) {
      setOpenDialogNotMember(true);
    }
  }, [profile]);

  return (
    <>
      <DialogNotMember
        profile={profile ?? undefined}
        open={openDialogNotMember}
        handleOpen={() => {
          setOpenDialogRegister(true);
          setOpenDialogNotMember(false);
        }}
      />
      <DialogRegister
        picture={profile?.pictureUrl}
        open={openDialogRegister}
        handleClose={(open) => {
          setOpenDialogRegister(open);
          setOpenDialogNotMember(true);
        }}
      />
    </>
  );
};

export default NotMemberPage;

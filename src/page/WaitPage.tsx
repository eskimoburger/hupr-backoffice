import SandWatch from "@/assets/sand-watch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";

import { FC } from "react";
import { useNavigate } from "react-router-dom";

const DialogWaitingActive: FC<{
  open: boolean;
  handleClose: (open: boolean) => void;
}> = ({ handleClose, open }) => {
  const navigate = useNavigate();
  return (
    <Dialog open={open} modal onOpenChange={handleClose}>
      <DialogContent className="text-center">
        <div className="grid place-items-center">
          <SandWatch />
        </div>
        <h1 className="text-2xl text-[#B28A4C] font-bold text-center">
          กำลังดำเนินการ...
        </h1>
        <p className="text-base font-light ">
          ข้อมูลของคุณกำลังดำเนินการรอตรวจสอบ
        </p>
        <p className="text-base font-light  leading-[2px]">
          และรออนุมัติจากแอดมิน เพื่อเข้าถึงข้อมูลหน้าเว็บได้
        </p>

        <DialogFooter className="flex-col sm:justify-center gap-1">
          <Button
            onClick={() => {
              navigate("/login");
            }}
            type="submit"
            form="register"
            size={"sm"}
            variant="default"
            className="bg-[#B28A4C] text-white hover:bg-[#9b6f3f] active:bg-[#7d5633]"
          >
            กลับสู่เข้าสู่ระบบ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const WaitPage = () => {
  return <DialogWaitingActive open={true} handleClose={() => {}} />;
};

export default WaitPage;

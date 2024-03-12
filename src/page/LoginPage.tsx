import { Button } from "@/components/ui/button";
import liff from "@line/liff";
import LineLogo from "@/assets/line_88.png";
import { useCallback, useEffect } from "react";
import Logo from "@/assets/logo";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks";
const LoginPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const liffInit = useCallback(async () => {
    try {
      await liff.init({ liffId: import.meta.env.VITE_LIFF_ID });
      if (liff.isLoggedIn()) {
        const token = liff.getIDToken();
        const res = await axios.post(
          `https://api-beacon.adcm.co.th/api/auth/login-line`,
          {
            token,
          }
        );

        if (!res.data.response_data.data.user.active) {
          navigate("/wait");
        } else {
          navigate("/");
          const { access_token, refresh_token, user } =
            res.data.response_data.data;
          auth.login(access_token, refresh_token, user.uuid);
        }
      }
    } catch (error) {
      console.error(error);
      navigate("/not-member");
    }
  }, [navigate, auth]);
  useEffect(() => {
    liffInit();
  }, [liffInit]);

  const handleLogin = async () => {
    try {
      const token = liff.getIDToken();
      if (!token) {
        liff.login();
      }
      const res = await axios.post(
        `https://api-beacon.adcm.co.th/api/auth/login-line`,
        {
          token,
        }
      );

      if (!res.data.response_data.data.user.active) {
        navigate("/wait");
      } else {
        navigate("/");
        const { access_token, refresh_token, user } =
          res.data.response_data.data;
        auth.login(access_token, refresh_token, user.uuid);
      }
    } catch (err) {
      console.log(err);
      navigate("/not-member");
    }
  };

  return (
    <div className=" h-full flex flex-col  items-center justify-center">
      <Logo width="100" height="100" />
      <div className=" text-[#666666] text-8xl font-bold flex items-center   ">
        <span className="text-[#B28A4C]">HU</span>
        <span>PR</span>
      </div>
      <div className="my-6" />
      <section className="text-[#A1A1A1] text-center">
        <h1 className="text-xl font-bold ">ยินดีต้อนรับเข้าสู่</h1>
        <p className="text-base font-light">
          ระบบบริหารจัดการข้อมูลสำหรับการประชาสัมพันธ์คณะมนุษยศาสตร์
        </p>
        <p className="text-base font-light">
          {" "}
          หวังว่าคุณจะมีความสุขกับการใช้ระบบ !
        </p>
      </section>
      <div className="my-6" />
      <Button
        onClick={handleLogin}
        className="bg-[#06C755] text-white hover:bg-[#09b24b] active:bg-[#028b3a]  "
        variant={"default"}
      >
        <img src={LineLogo} alt="line" className="h-10 w-10" />
        <div className="border-l-[0.5px] border-black/[8] h-full ml-1 mr-2" />
        <span>ล็อกอินด้วย LINE</span>
      </Button>
    </div>
  );
};

export default LoginPage;

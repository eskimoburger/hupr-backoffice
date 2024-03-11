import {
  FC,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Menu,
  MenuItem,
  Sidebar as ProSidebar,
  SubMenu,
} from "react-pro-sidebar";
import { NavLink } from "react-router-dom";
import Logo from "../assets/logo";
import BeaconIcon from "@/assets/beacon-icon";
import MemberIcon from "@/assets/member-icon";
import ContentIcon from "@/assets/content-icon";
import HomeIcon from "@/assets/home-icon";
import { LogOutIcon, MenuIcon } from "lucide-react";
import { useAuth } from "@/hooks";
import useSWR from "swr";
import { fetcher } from "@/api";

import { ProfileResponse } from "@/types/profile";

type Menu = {
  label: string;
  key: string;
  icon?: JSX.Element | Element | ReactNode;
  path?: string;
  sub?: SubMenu[];
};

type SubMenu = {
  label: string;
  key: string;
  icon: JSX.Element | Element | ReactNode;
  path: string;
};

type NavbarProps = {
  toggleSidebar: () => void;
  showBackground?: boolean;
  broken: boolean;
  handleCollapse: () => void;
  // onLogout?: () => void;
};
const Navbar: FC<NavbarProps> = ({
  toggleSidebar,
  showBackground,
  broken,
  handleCollapse,
  // onLogout,
}) => {
  const auth = useAuth();
  const { data } = useSWR<ProfileResponse>(
    auth.isLogin ? `https://api-beacon.adcm.co.th/api/user/${auth.user}` : null,
    fetcher
  );
  

  return (
    <div
      className={`navbar fixed top-0  right-0 bg-white border-b-[1px] border-[#B28A4C] text-white h-[80px] z-[30] 
    backdrop-filter backdrop-blur-lg 
    transition-colors duration-500 flex justify-between items-center
    ${showBackground ? "bg-opacity-80" : ""}`}
    >
      <div className="flex">
        {broken && (
          <button
            className="btn btn-link btn-sm text-black"
            onClick={toggleSidebar}
          >
            <MenuIcon size={24} />
          </button>
        )}
        <button
          onClick={handleCollapse}
          className="ml-4 text-[#666666] text-4xl font-bold flex items-center"
        >
          <span className="text-[#B28A4C]">HU</span>
          <span>PR</span>
          <Logo />
        </button>
      </div>

      {data && (
        <div className="dropdown dropdown-bottom dropdown-end mr-5 ">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xl font-bold">
              {data.response_data.data.line_name}
            </span>
            <button className="avatar">
              <div className="w-12 rounded-full">
                <img src={data.response_data.data.picture} alt="profile" />
              </div>
            </button>
          </div>

          <ul className=" dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <button
                className="bg-white text-black flex items-center 
              hover:bg-primary               
              hover:text-white rounded-md p-2
              
              "
                onClick={() => {
                  auth.logout();
                }}
              >
                <LogOutIcon size={24} />
                <span className="ml-2">ออกจากระบบ</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const TOP_OFFSET = 50;
  const [showBackground, setShowBackground] = useState(false);
  const [broken, setBroken] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);

  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mainElement = mainRef.current;

    const handleScroll = () => {
      const scrollY = mainElement?.scrollTop;
      if (scrollY && scrollY >= TOP_OFFSET) {
        setShowBackground(true);
      } else {
        setShowBackground(false);
      }
    };

    mainElement?.addEventListener("scroll", handleScroll);

    return () => {
      mainElement?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const menus: Menu[] = [
    {
      key: "dashboard",
      label: "หน้าแรก",
      icon: <HomeIcon />,
    },
    {
      key: "content",
      label: "สร้างสื่อ",
      path: "/content",
      icon: <ContentIcon />,
    },
    {
      key: "beacon",
      label: "บีคอน",
      path: "/beacon",
      icon: <BeaconIcon />,
    },
    {
      key: "member",
      label: "สมาชิก",
      path: "/member",
      icon: <MemberIcon />,
    },
  ];

  return (
    <>
      <Navbar
        {...{ showBackground, broken }}
        toggleSidebar={() => {
          setToggled(!toggled);
        }}
        handleCollapse={() => {
          setCollapsed(!collapsed);
        }}
      />

      <div className="h-full flex relative">
        <ProSidebar
          rootStyles={{
            borderColor: "transparent",
            borderRight: "1px solid #B28A4C",
          }}
          onBackdropClick={() => setToggled(false)}
          toggled={toggled}
          collapsed={collapsed}
          breakPoint="md"
          backgroundColor="white"
          onBreakPoint={(broken) => {
            setBroken(broken);
            setCollapsed(false);
          }}
          width={"240px"}
        >
          <div className="flex flex-col h-full px-2 ">
            <div className="h-[80px] my-1  flex items-center justify-center">
              <button
                onClick={() => {
                  setToggled(false);
                }}
                className="text-[#666666] text-4xl font-bold flex items-center"
              >
                <span className="text-[#B28A4C]">HU</span>
                <span>PR</span>
                <Logo />
              </button>
            </div>
            <Menu
              menuItemStyles={{
                root: {
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                },
                icon: {
                  fontSize: "24px",
                },
                button: {
                  margin: "4px 0",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  color: "#666666",
                  transition: "ease-in-out 0.2s",
                  fontWeight: 500,

                  [`&:hover`]: {
                    backgroundColor: "rgba(178, 138, 76, 0.2)",
                    color: "rgba(178, 138, 76, 1)",
                  },
                  [`&.active`]: {
                    backgroundColor: "rgba(178, 138, 76, 0.2)",
                    color: "rgba(178, 138, 76, 1)",
                    [`& svg path`]: {
                      stroke: "currentcolor",
                    },
                    "& svg#content-icon path": {
                      fill: "currentcolor",
                      strokeWidth: "0",
                    },
                  },
                },
              }}
            >
              {menus.map((menu) => {
                if (menu.sub) {
                  return (
                    <SubMenu
                      key={`sub-menu-${menu.key}`}
                      label={menu.label}
                      style={{
                        fontSize: "14px",
                        fontWeight: "bolder",
                        color: "gray",
                      }}
                      //   icon={collapsed ? <MdFormatListBulleted /> : null}
                      defaultOpen
                    >
                      {menu.sub.map((subMenu) => (
                        <MenuItem
                          onClick={() => {
                            setToggled(false);
                          }}
                          key={`sub-menu-${subMenu.key}`}
                          icon={subMenu.icon as ReactNode}
                          component={<NavLink to={subMenu.path} />}
                        >
                          {subMenu.label}
                        </MenuItem>
                      ))}
                    </SubMenu>
                  );
                }

                return (
                  <MenuItem
                    onClick={() => {
                      setToggled(false);
                    }}
                    key={`top-menu-${menu.key}`}
                    icon={menu.icon as ReactNode}
                    component={<NavLink to={menu.path ?? "/"} />}
                  >
                    {menu.label}
                  </MenuItem>
                );
              })}
            </Menu>
          </div>
        </ProSidebar>

        <main
          ref={mainRef}
          className="flex-grow mt-[80px]   overflow-y-auto no-scrollbar"
        >
          <div className="p-8">{children}</div>
        </main>
      </div>
    </>
  );
};

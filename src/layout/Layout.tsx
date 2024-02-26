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
import axios from "axios";

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
  // onLogout?: () => void;
};
const Navbar: FC<NavbarProps> = ({
  toggleSidebar,
  showBackground,
  broken,
  // onLogout,
}) => {
  async function handleConnect() {
    try {
      const response = await axios.post(
        "https://api-beacon.adcm.co.th/api/auth/login",
        {
          email: "admin@mail.com",
          password: "testtest",
        }
      );
      localStorage.setItem(
        "accessToken",
        response.data.response_data.data.access_token
      );
      window.location.reload();
    } catch (err) {
      console.log("err", err);
    }
  }
  return (
    <div
      className={`navbar fixed top-0  right-0 bg-white border-b-[1px] border-[#B28A4C] text-white h-[80px] z-50 
    backdrop-filter backdrop-blur-lg 
    transition-colors duration-500 flex justify-between items-center
    ${showBackground ? "bg-opacity-80" : ""}`}
    >
      <div>
        {broken && (
          <button
            className="btn btn-link btn-sm text-black"
            onClick={toggleSidebar}
          >
            {/* <MdMenu size={24} /> */}
            toggle
          </button>
        )}
        <button className="text-[#666666] text-4xl font-bold flex items-center">
          <span className="text-[#B28A4C]">HU</span>
          <span>PR</span>
          <Logo />
        </button>
      </div>

      <button className="btn bg-[#B28A4C] text-white" onClick={handleConnect}>
        เชื่อมต่อ
      </button>
    </div>
  );
};

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const TOP_OFFSET = 50;
  const [showBackground, setShowBackground] = useState(false);
  const [broken, setBroken] = useState(false);
  const collapsed = false;
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
    },
    {
      key: "content",
      label: "คอนเทนต์",
      path: "/content",
    },
    {
      key: "beacon",
      label: "บีคอน",
      path: "/beacon",
    },
    {
      key: "member",
      label: "สมาชิก",
      path: "/member",
    },
  ];

  return (
    <>
      <Navbar
        {...{ showBackground, broken }}
        toggleSidebar={() => {
          setToggled(!toggled);
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
          onBreakPoint={setBroken}
          width={"240px"}
        >
          <div className="flex flex-col h-full  ">
            <div className="h-[80px] my-1" />
            <Menu
              menuItemStyles={{
                root: {
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                },
                icon: {
                  //   color: "#19A0E4",
                  fontSize: "24px",
                },
                button: {
                  margin: "4px",
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

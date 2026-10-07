import PageHead from "@/components/commons/PageHead";
import { ReactNode, useState } from "react";
import DashboardLayoutSidebar from "./DashboardLayoutSidebar";
import { SIDEBAR_ADMIN, SIDEBAR_MEMBER } from "./DashboardLayout.constants";
import { Navbar, NavbarMenuToggle } from "@heroui/react";

interface DashboardLayoutProps {
  title: string;
  children: ReactNode;
  type: string;
  description?: string;
}

const DashboardLayout = (props: DashboardLayoutProps) => {
  const { title, children, type = "admin", description } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHead title={title}></PageHead>
      <div className="max-w-screen-3xl 3xl:container flex">
        <DashboardLayoutSidebar
          sidebarItems={type === "admin" ? SIDEBAR_ADMIN : SIDEBAR_MEMBER}
          isOpen={open}
        />
        <div className="h-screen w-full overflow-y-auto p-8">
          <Navbar
            className="flex justify-between bg-transparent px-0"
            isBlurred={false}
            classNames={{ wrapper: "p-0" }}
            position="static"
          >
            <h1 className="text-3xl font-bold">{title}</h1>
            <NavbarMenuToggle
              aria-label={open ? "Close menu" : "Open menu"}
              onPress={() => setOpen(!open)}
              className="lg:hidden"
            />
          </Navbar>
          <p className="text-small mb-4">{description}</p>
          {children}
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;

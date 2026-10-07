import { cn } from "@/utils/cn";
import { Button, Listbox, ListboxItem } from "@heroui/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { CiLogout } from "react-icons/ci";

interface sidebarItem {
  key: string;
  label: string;
  href: string;
  icon: JSX.Element;
}

interface DahboardLayoutSidebarProps {
  sidebarItems: sidebarItem[];
  isOpen: boolean;
}

const DashboardLayoutSidebar = (props: DahboardLayoutSidebarProps) => {
  const { sidebarItems, isOpen } = props;
  const router = useRouter();
  return (
    <div
      className={cn(
        "border-r-1 border-default-200 fixed z-50 flex h-screen w-full max-w-[300px] -translate-x-full flex-col justify-between bg-white px-4 py-6 transition-all lg:relative lg:translate-x-0",
        {
          "translate-x-0": isOpen,
        }
      )}
    >
      <div>
        <div className="flex w-full justify-center">
          <Image
            src="/images/general/logo.svg"
            alt="Logo"
            width={180}
            height={60}
            className="mb-6 w-32"
            onClick={() => router.push("/")}
          />
        </div>
        <Listbox
          items={sidebarItems}
          variant="solid"
          aria-label="Dashboard Menu"
        >
          {item => (
            <ListboxItem
              key={item.key}
              className={cn("my-1 h-12 text-2xl", {
                "bg-danger-500 text-white": router.pathname.startsWith(
                  item.href
                ),
              })}
              startContent={item.icon}
              textValue={item.label}
              aria-labelledby={item.label}
              aria-describedby={item.label}
            >
              <p className="text-small">{item.label}</p>
            </ListboxItem>
          )}
        </Listbox>
      </div>
      <div className="flex items-center p-1">
        <Button
          color="danger"
          fullWidth
          variant="light"
          className="flex justify-start rounded-lg px-2 py-1.5"
          size="lg"
          onClick={() => signOut()}
        >
          <CiLogout />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default DashboardLayoutSidebar;

import { FaFacebook, FaTiktok, FaTwitter, FaYoutube } from "react-icons/fa6";

const NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Explore",
    href: "/events",
  },
];

const BUTTON_ITEMS = [
  {
    label: "REGISTER",
    href: "/auth/register",
    variant: "bordered",
  },
  {
    label: "LOGIN",
    href: "/auth/login",
    variant: "solid",
  },
];

const SOCIAL_ITEMS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/yourpage",
    icon: <FaFacebook />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/yourpage",
    icon: <FaTwitter />,
  },
  {
    label: "Tiktok",
    href: "https://www.tiktok.com/@yourpage",
    icon: <FaTiktok />,
  },
  {
    label: "Twitter",
    href: "https://twitter.com/yourpage",
    icon: <FaTwitter />,
  },
  {
    label: "Youtube",
    href: "https://www.youtube.com/yourpage",
    icon: <FaYoutube />,
  },
];

export { NAV_ITEMS, BUTTON_ITEMS, SOCIAL_ITEMS };

import { SideNavItem } from "@/Types";
import {
  IconLayoutDashboard,
  IconWallet,
  IconArrowsExchange,
  IconReceipt,
  IconBuildingBank,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Home",
    path: "/user/dashboard",
    icon: <IconLayoutDashboard size={28} />,
  },
  {
    title: "Wallet",
    path: "/user/wallet",
    icon: <IconWallet size={28} />,
  },
  {
    title: "Transfer Money",
    path: "/user/transfer",
    icon: <IconArrowsExchange size={28} />,
  },
  {
    title: "Transactions",
    path: "/user/transactions",
    icon: <IconReceipt size={28} />,
  },
  {
    title: "Bill Payments",
    path: "/user/bills",
    icon: <IconBuildingBank size={28} />,
  },
];

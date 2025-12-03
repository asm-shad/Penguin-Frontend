"use client";

import Link from "next/link";
import { motion } from "motion/react";

interface TabItem {
  id: string;
  title: string;
  slug: string;
}

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
  categories: TabItem[];
}

const HomeTabbar = ({ selectedTab, onTabSelect, categories }: Props) => {
  return (
    <div className="flex items-center flex-wrap gap-5 justify-between">
      <div className="flex items-center gap-1.5 text-sm font-semibold">
        <div className="flex items-center gap-1.5 md:gap-3 flex-wrap">
          {categories.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => onTabSelect(item.title)}
              className={`border px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-shop_light_green hover:border-shop_light_green hover:text-white transition-all duration-300 ${
                selectedTab === item.title
                  ? "bg-shop_light_green text-white border-shop_light_green shadow-lg"
                  : "bg-shop_light_green/10 border-shop_light_green/30"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.title}
            </motion.button>
          ))}
        </div>
      </div>

      <Link
        href="/shop"
        className="border border-darkColor px-4 py-2 rounded-full hover:bg-shop_light_green hover:text-white hover:border-shop_light_green transition-all duration-300"
      >
        <span className="flex items-center gap-2">
          View All Products
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </Link>
    </div>
  );
};

export default HomeTabbar;

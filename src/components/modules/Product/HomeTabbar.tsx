"use client";
import Link from "next/link";

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
    <div className="flex items-center flex-wrap gap-5 justify-between ml-5 mx-5">
      <div className="flex items-center gap-1.5 text-sm font-semibold">
        <div className="flex items-center gap-1.5 md:gap-3">
          {categories?.map((item) => (
            <button
              onClick={() => onTabSelect(item?.id)}
              key={item?.id}
              className={`border border-shop_light_green/30 px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-shop_light_green hover:border-shop_light_green hover:text-white hoverEffect ${
                selectedTab === item?.id
                  ? "bg-shop_light_green text-white border-shop_light_green"
                  : "bg-shop_light_green/10"
              }`}
            >
              {item?.title}
            </button>
          ))}
        </div>
      </div>
      <Link
        href={"/sale"} // Changed from "/shop" to "/sale" as requested
        className="border border-darkColor px-4 py-1 rounded-full hover:bg-shop_light_green hover:text-white hover:border-shop_light_green hoverEffect"
      >
        See all
      </Link>
    </div>
  );
};

export default HomeTabbar;

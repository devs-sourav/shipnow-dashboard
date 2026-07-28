import {
  PiTruckBold,
  PiPresentationChartBold,
  PiCurrencyDollarBold,
} from "react-icons/pi";
import StatCard from "@/components/dashboard/Statcard";
import ProfitSummary from "@/components/shipment/ProfitSummary";
import ShipmentStatistic from "@/components/shipment/Shipmentstatistic";
import ShipmentType from "@/components/shipment/ShipmentType";
import ProductCategories from "@/components/dashboard/Productcategories";
import LiveTracking from "@/components/dashboard/Livetracking";
import ShipmentAlerts from "@/components/dashboard/ShipmentAlerts";
import ShipmentDashboard from "@/components/dashboard/Shipmentdashboard";
import RecentActivity from "@/components/dashboard/RecentActivity";

// Type definition for each stat card
interface StatCardData {
  id: number;
  label: string;
  value: string;
  unit?: string;
  trendValue: number;
  trendPeriod: string;
  icon: React.ReactNode;
}

// Mock data for stat cards
const statCardsData: StatCardData[] = [
  {
    id: 1,
    label: "Active Shipments",
    value: "1,284",
    unit: "shipments",
    trendValue: 8.7,
    trendPeriod: "from last week",
    icon: <PiTruckBold />,
  },
  {
    id: 2,
    label: "Delivery Performance",
    value: "94.3%",
    unit: "on-time",
    trendValue: -1.2,
    trendPeriod: "from last week",
    icon: <PiPresentationChartBold />,
  },
  {
    id: 3,
    label: "Revenue",
    value: "$82,450",
    trendValue: 12.4,
    trendPeriod: "from last month",
    icon: <PiCurrencyDollarBold/>,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        {/* Top Cards */}
        <div className="col-span-12 lg:col-span-9">
          <div className="grid grid-cols-12 gap-4">
            {statCardsData.map((card) => (
              <div
                key={card.id}
                className="rounded-2xl col-span-12 md:col-span-4 bg-white shadow-sm h-[120px]"
              >
                <StatCard
                  label={card.label}
                  value={card.value}
                  unit={card.unit}
                  trendValue={card.trendValue}
                  trendPeriod={card.trendPeriod}
                  icon={card.icon}
                />
              </div>
            ))}

            {/* Bottom Left */}
            <div className="col-span-12 md:col-span-5">
              <div className="rounded-2xl bg-white shadow-sm h-[266px] overflow-hidden">
                <ShipmentStatistic />
              </div>
            </div>
            {/* Bottom Middle */}
            <div className="col-span-12 md:col-span-7">
              <div className="rounded-2xl bg-white shadow-sm h-[266px]">
                <ProfitSummary />
              </div>
            </div>
          </div>
        </div>
        {/* Right Doughnut */}
        <div className="col-span-12 md:col-span-5 lg:col-span-3">
          <div className="rounded-2xl bg-white shadow-sm h-[443px] lg:h-[400px]">
            <ShipmentType />
          </div>
        </div>
        <div className="col-span-12 md:col-span-7  block lg:hidden shadow-sm rounded-2xl bg-white">
          <ProductCategories />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[443px] w-full">
        <div className="grid col-span-9  ">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-5 hidden lg:block shadow-sm rounded-2xl bg-white">
              <ProductCategories />
            </div>
            <div className="col-span-12 lg:col-span-7 shadow-sm rounded-2xl p-3 h-[443px] bg-white">
              <LiveTracking />
            </div>
          </div>
        </div>
        <div className=" col-span-3 shadow-sm hidden lg:block rounded-xl bg-white overflow-hidden">
          <ShipmentAlerts />
        </div>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
          <ShipmentAlerts />
          <RecentActivity  />
        </div>
        <ShipmentDashboard />
      </div>
    </div>
  );
}

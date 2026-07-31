import ComingSoon from "@/components/layout/ComingSoon";
import StatsCardsOverview from "@/components/invoice/StatsCardsOverview"
import InvoicePage from "@/components/invoice/Invoicespage"
export default function InvoicePageDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <StatsCardsOverview />
        </div>
        <div className="col-span-12">
          <InvoicePage/>
        </div>

      </div>
    </div>
  );
}

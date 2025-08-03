import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { FeaturesTable } from "@/components/features-table"
import { SectionCards } from "@/components/section-cards"
import { UpgradeButton } from "@/app/components/UpgradeButton"

export default function Page() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      
      {/* Upgrade Section */}
      <div className="px-4 lg:px-6">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-2">Upgrade to Pro</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start your 14-day free trial. No credit card required.
          </p>
          <UpgradeButton priceId="prod_SnmfJaagLwUMPE">
            Start Free Trial
          </UpgradeButton>
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <div className="px-4 lg:px-6">
        <FeaturesTable />
      </div>
    </div>
  )
}

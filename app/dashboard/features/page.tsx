import { FeaturesTable } from '@/components/features-table';

export default function FeaturesPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Features</h1>
        <p className="text-muted-foreground">
          Manage your feature requests and track user interest
        </p>
      </div>
      
      <FeaturesTable />
    </div>
  );
}
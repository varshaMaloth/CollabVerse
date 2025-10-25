'use client';

import { DynamicReportGenerator } from '@/components/dashboard/dynamic-report-generator';

export default function ReportsPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-6">Automated Progress Reports</h2>
      <DynamicReportGenerator />
    </div>
  );
}

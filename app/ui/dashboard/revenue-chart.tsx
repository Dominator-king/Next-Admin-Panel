import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

import { fetchRevenue } from '@/app/lib/data';
import BarChart from './barChart';

// This component is representational only.
// For data visualization UI, check out:
// https://www.tremor.so/
// https://www.chartjs.org/
// https://airbnb.io/visx/

export default async function RevenueChart() {
  const rev = await fetchRevenue();
  // const chartHeight = 350;
  // NOTE: comment in this code when you get to this point in the course

  // const { yAxisLabels, topLabel } = generateYAxis(revenue);

  if (!rev || rev.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return (
    <div className=" flex h-full flex-col  md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Recent Revenue
      </h2>

      {/* NOTE: comment in this code when you get to this point in the course */}
      <div className=" grow  rounded-xl bg-gray-50 p-4">
        <BarChart rev={rev} />
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Last 12 months</h3>
        </div>
      </div>
    </div>
  );
}

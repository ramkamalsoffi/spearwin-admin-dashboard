import React, { lazy, Suspense } from 'react';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = lazy(() => import('react-apexcharts'));

const LineChartOne: React.FC = () => {
  const chartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yaxis: {
      title: {
        text: 'Sales',
      },
    },
    colors: ['#3C50E0', '#80CAEE', '#8FD0EF'],
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val + ' units';
        },
      },
    },
  };

  const series = [
    {
      name: 'Sales',
      data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45],
    },
    {
      name: 'Revenue',
      data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51],
    },
    {
      name: 'Profit',
      data: [10, 15, 20, 15, 25, 20, 30, 25, 35, 20, 25, 30],
    },
  ];

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Total Sales</p>
              <p className="text-sm font-medium">12.04.2022 - 12.05.2022</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Total Revenue</p>
              <p className="text-sm font-medium">12.04.2022 - 12.05.2022</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-success">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-success"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-success">Total Profit</p>
              <p className="text-sm font-medium">12.04.2022 - 12.05.2022</p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-full bg-meta-4 px-3 py-1 text-sm">
            <span className="w-1 h-1 rounded-full bg-meta-5 mr-2"></span>
            Live Period
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <Suspense fallback={<div className="flex items-center justify-center h-[350px]">Loading chart...</div>}>
            <Chart
              options={chartOptions}
              series={series}
              type="line"
              height={350}
              width="100%"
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default LineChartOne;

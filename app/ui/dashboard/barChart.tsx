'use client';

import { Revenue } from '@/app/lib/definitions';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useState } from 'react';

import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function BarChart({ revenue }: { revenue: Revenue[] }) {
  console.log(revenue);
  return (
    <Bar
      data={{
        labels: revenue.map((month) => month.month),
        datasets: [
          {
            label: 'revenue',
            data: revenue.map((month) => month.revenue),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 0.5,
          },
        ],
      }}
      options={{
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      }}
    />
  );
}

import { FC, forwardRef } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ChartData,
  LineElement,
  PointElement,
  Point,
  BubbleDataPoint,
  Plugin,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Graph } from "@/types/overview";
import { ChartJSOrUndefined } from "node_modules/react-chartjs-2/dist/types";
import { AnyObject } from "node_modules/chart.js/dist/types/basic";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

interface ChartProps {
  data: Graph[];
  isLoading?: boolean;
}

const LineChart: FC<ChartProps> = ({ data, isLoading }) => {
  const chartData: ChartData<"line", number[], string> = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: `${"ข้อความเป็น จำนวนข้อความที่ส่ง "} (${"ครั้ง"})`,
        data: data.map((item) => (item.message_count ? item.message_count : 0)),
        borderColor: "#48DAA5",
        backgroundColor: "#48DAA5",
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 4,
      },
      {
        label: `${"จำนวนผู้ใช้"} (${"คน"})`,
        data: data.map((item) => (item.user_count ? item.user_count : 0)),
        borderColor: "#EB96E7",
        backgroundColor: "#EB96E7",
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 4,
      },
      {
        label: `${"จำนวนครั้งที่ผู้ใช้เข้ามาในบีคอน"} (${"ครั้ง"})`,
        data: data.map((item) => (item.visit_count ? item.visit_count : 0)),
        borderColor: "#285FCA",
        backgroundColor: "#285FCA",
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 4,
        pointStyle: "circle",
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
          drawOnChartArea: false,
          drawTicks: false,
        },
        display: true,
        title: {
          display: true,
          text: "วันที่" as string,
          color: "black",
          font: {
            size: 14,
            weight: "bold" as const,
            lineHeight: "1.2",
          },
          padding: { top: 20, left: 0, right: 0, bottom: 0 },
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "จำนวน" as string,
          color: "black",
          font: {
            size: 14,
            weight: "bold" as const,
            lineHeight: "1.2",
          },
          padding: { top: 20, left: 0, right: 0, bottom: 0 },
        },
      },
    },
    plugins: {
      legend: {
        algin: "start" as const,
        position: "top" as const,
        labels: {
          usePointStyle: true,
        },
      },
      title: {
        display: false,
      },
    },
  };
  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#B28A4C]"></div>
      </div>
    );
  }
  if (data.length === 0)
    return (
      <div className="flex w-full h-full items-center justify-center">
        <h1 className="text-2xl font-bold text-[#B28A4C] mb-2">ไม่มีข้อมูล</h1>
      </div>
    );
  return (
    <Line
      data={chartData}
      options={{
        ...options,
        plugins: {
          ...options.plugins,
          tooltip: {
            intersect: false,
            titleColor: "white",
            bodyColor: "white",
            bodySpacing: 8,
            usePointStyle: true,
          },
        },
      }}
    />
  );
};

export type LineChartRef = ChartJSOrUndefined<
  "line",
  (number | Point | [number, number] | BubbleDataPoint | null)[],
  unknown
>;
interface ChartWithRefProps {
  data: Graph[];
  isLoading?: boolean;
}

export const LineChartWithRef = forwardRef<LineChartRef, ChartWithRefProps>(
  ({ data, isLoading }, ref) => {
    const chartData: ChartData<"line", number[], string> = {
      labels: data.map((item) => item.date),
      datasets: [
        {
          label: `${"ข้อความเป็น จำนวนข้อความที่ส่ง "} (${"ครั้ง"})`,
          data: data.map((item) =>
            item.message_count ? item.message_count : 0
          ),
          borderColor: "#48DAA5",
          backgroundColor: "#48DAA5",
          tension: 0.3,
          pointRadius: 0,
          borderWidth: 4,
        },
        {
          label: `${"จำนวนผู้ใช้"} (${"คน"})`,
          data: data.map((item) => (item.user_count ? item.user_count : 0)),
          borderColor: "#EB96E7",
          backgroundColor: "#EB96E7",
          tension: 0.3,
          pointRadius: 0,
          borderWidth: 4,
        },
        {
          label: `${"จำนวนครั้งที่ผู้ใช้เข้ามาในบีคอน"} (${"ครั้ง"})`,
          data: data.map((item) => (item.visit_count ? item.visit_count : 0)),
          borderColor: "#285FCA",
          backgroundColor: "#285FCA",
          tension: 0.3,
          pointRadius: 0,
          borderWidth: 4,
          pointStyle: "circle",
        },
      ],
    };
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false,
            drawOnChartArea: false,
            drawTicks: false,
          },
          display: true,
          title: {
            display: true,
            text: "วันที่" as string,
            color: "black",
            font: {
              size: 14,
              weight: "bold" as const,
              lineHeight: "1.2",
            },
            padding: { top: 20, left: 0, right: 0, bottom: 0 },
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "จำนวน" as string,
            color: "black",
            font: {
              size: 14,
              weight: "bold" as const,
              lineHeight: "1.2",
            },
            padding: { top: 20, left: 0, right: 0, bottom: 0 },
          },
        },
      },
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      plugins: {
        legend: {
          algin: "start" as const,
          position: "top" as const,
          labels: {
            usePointStyle: true,
          },
        },
        title: {
          display: false,
        },
      },
    };
    if (isLoading) {
      return (
        <div className="flex w-full h-full items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#B28A4C]"></div>
        </div>
      );
    }
    if (data.length === 0)
      return (
        <div className="flex w-full h-full items-center justify-center">
          <h1 className="text-2xl font-bold text-[#B28A4C] mb-2">
            ไม่มีข้อมูล
          </h1>
        </div>
      );

    const DrawBackGround: Plugin<"line", AnyObject> = {
      id: "background",
      beforeDraw: (chart) => {
        const ctx = chart.ctx;
        ctx.save();
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      },
    };
    return (
      <Line
        ref={ref}
        data={chartData}
        options={{
          ...options,
          plugins: {
            ...options.plugins,
            tooltip: {
              intersect: false,
              titleColor: "white",
              bodyColor: "white",
              bodySpacing: 8,
              usePointStyle: true,
            },
          },
        }}
        plugins={[DrawBackGround]}
      />
    );
  }
);

export default LineChart;

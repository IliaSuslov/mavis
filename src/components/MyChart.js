import React from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Bar } from "react-chartjs-2";
import planData from "../plan.json";
import moment from "moment";
import { convertMillisecondsToHoursMinutesSeconds } from "../App";
Chart.register(CategoryScale);
export function MyChart({ data, name, date }) {
  const getPlannedWH = (date, name) => {
    const obj = planData.filter(
      (v) =>
        v.name === name && moment(v.timePlanFrom).format("YYYY-MM-DD") === date
    )[0];

    const planHours = convertMillisecondsToHoursMinutesSeconds(
      new Date(obj?.timePlanTo) - new Date(obj?.timePlanFrom)
    ).hours;

    return planHours;
  };
  const plan = data.map((v) => {
    return {
      label: `${v.label} plan`,
      data: v.data.map((el) => {
        return { key: el.key, value: getPlannedWH(el.key, v.label) - el.value };
      }),
      stack: v.label,
      backgroundColor: "black",
    };
  });
  const newData = data.concat(plan);

  return (
    <>
      <div className="flexRow">
        <h1>Рабочие часы: {name}</h1>
        <h1>Дата: {date}</h1>
      </div>
      <Bar
        data={{
          datasets: newData,
        }}
        options={{
          parsing: {
            xAxisKey: "key",
            yAxisKey: "value",
          },
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "График работы",
            },
            legend: {
              display: false,
            },
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true,
              },
            },
          },
        }}
      />
    </>
  );
}

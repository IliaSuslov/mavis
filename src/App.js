import "./App.css";
import { useEffect, useState } from "react";
import fact from "./fact.json";
import { Loader, MyChart, MySelect } from "./components";
import moment from "moment";
import { filterByDate, filterByName } from "./filter";

export const convertMillisecondsToHoursMinutesSeconds = (milliseconds) => {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  return { hours, minutes };
};

function generateRandomColor() {
  let maxVal = 0xffffff; // 16777215
  let randomNumber = Math.random() * maxVal;
  randomNumber = Math.floor(randomNumber);
  randomNumber = randomNumber.toString(16);
  let randColor = randomNumber.padStart(6, 0);
  return `#${randColor.toUpperCase()}`;
}

const getRightData = () => {
  const sortedData = fact.sort((a, b) => {
    return new Date(a.timeFactnTo) - new Date(b.timeFactFrom);
  });

  let options = [];

  sortedData.forEach((el) => {
    if (options.find((v) => v.label === el.name)) {
      options.find((v) => v.label === el.name).data = [
        ...options.find((v) => v.label === el.name).data,
        {
          key: moment(el.timeFactnTo).format("YYYY-MM-DD"),
          value: convertMillisecondsToHoursMinutesSeconds(
            new Date(el.timeFactnTo) - new Date(el.timeFactFrom)
          ).hours,
        },
      ];
    } else {
      options.push({
        label: el.name,
        stack: el.name,
        backgroundColor: generateRandomColor(),
        data: [
          {
            key: moment(el.timeFactnTo).format("YYYY-MM-DD"),
            value: convertMillisecondsToHoursMinutesSeconds(
              new Date(el.timeFactnTo) - new Date(el.timeFactFrom)
            ).hours,
          },
        ],
      });
    }
  });

  return options;
};

const getUniqOptions = (arr, key) => {
  let options = [];
  arr?.forEach((el) => {
    if (options.find((v) => v.value === el[key])) {
    } else {
      options.push({ value: el[key] });
    }
  });
  return options;
};

const getUniqDates = (arr) => {
  let options = [];
  arr?.forEach((el) => {
    el.data.forEach((dates) => {
      if (options.find((v) => v.value === dates.key)) {
      } else {
        options.push({ value: dates.key });
      }
    });
  });
  return options;
};

function App() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({ name: "all", date: "all" });
  const [peopleLimit, setPeopleLimit] = useState(5);

  const handleFilter = (event, key) => {
    setFilter({ ...filter, [key]: event.target.value });
  };

  const handlePeopleLimit = (event) => {
    if (event.target.value !== "all") {
      setPeopleLimit(event.target.value);
    } else {
      setPeopleLimit(data.length);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setData(getRightData());
    }, 1000);
  }, []);

  if (!data.length) return <Loader />;
  return (
    <>
      <div className="flexRow">
        <MySelect
          label={"Даты"}
          options={getUniqDates(data)}
          value={filter.date}
          onChange={(e) => handleFilter(e, "date")}
        />
        <MySelect
          label={"Имя Сотрудника"}
          options={getUniqOptions(data, "label")}
          value={filter.name}
          onChange={(e) => handleFilter(e, "name")}
        />

        <MySelect
          label={"Лимит человек"}
          options={[
            { value: 1 },
            { value: 3 },
            { value: 5 },
            { value: 10 },
            { value: 15 },
            { value: 20 },
          ]}
          value={peopleLimit}
          onChange={handlePeopleLimit}
        />
      </div>
      <MyChart
        data={filterByDate(filter.date)(filterByName(filter.name)(data)).filter(
          (_, i) => i < peopleLimit
        )}
        name={filter.name}
        date={filter.date}
      />
    </>
  );
}

export default App;

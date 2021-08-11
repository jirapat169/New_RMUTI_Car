import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Dashboard from "../../components/Dashboard";
import axios from "axios";
import GGMap from "../../components/GGmap";

const localizer = momentLocalizer(moment);
const colorList = [
  "#FF5733",
  "#FFAC33",
  "#33FF7A",
  "#33D7FF",
  "#F033FF",
  "#FF3383",
];

const Home = (props) => {
  // console.log(moment().toDate());
  const [events, setEvent] = React.useState([]);

  const getEvent = () => {
    axios
      .post(`${props.env.api_url}requestcar/getRequest`)
      .then((val) => {
        console.log(val.data);
        if (val.data.result.rowCount > 0) {
          let eventsData = [];
          // if (`${props.userLogin.myrole}` == "5") {
          //   eventsData = [...val.data.result.result]
          //     .filter(
          //       (e) => e.mystep == "1" || e.mystep == "2" || e.mystep == "3"
          //     )
          //     .filter(
          //       (ee) => `${ee.user_driver}` == `${props.userLogin.username}`
          //     );
          // } else {
          //   eventsData = [...val.data.result.result].filter(
          //     (e) => e.mystep == "1" || e.mystep == "2" || e.mystep == "3"
          //   );
          // }
          eventsData = [...val.data.result.result];

          eventsData = eventsData.map((e) => {
            return {
              start: new Date(e.date_start),
              end: new Date(e.date_end),
              title: e.reason,
              data: { ...e },
              color:
                `${e.mystep}` == "5"
                  ? "#F8D7DA"
                  : `${e.mystep}` == "4"
                  ? "#D4EDDA"
                  : "#FFF3CD",
              // colorList[Math.floor(Math.random() * colorList.length - 1)],
            };
          });

          setEvent(eventsData);
        } else {
          setEvent([]);
        }
      })
      .catch((reason) => {
        console.log(reason);
      });
  };

  React.useEffect(() => {
    getEvent();
  }, []);

  return (
    <Dashboard {...props}>
      <Calendar
        localizer={localizer}
        events={[
          ...events,
          // {
          //   start: moment().toDate(),
          //   end: moment().add(1, "days").toDate(),
          //   title: "Event 1",
          // },
          // {
          //   start: moment().add(5, "days").toDate(),
          //   end: moment().add(8, "days").toDate(),
          //   title: "Event 2",
          // },
        ]}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={(e) => {
          console.log(e);
        }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.color,
            color: "black",
          },
        })}
        style={{ height: 500 }}
      />
    </Dashboard>
  );
};

export default Home;

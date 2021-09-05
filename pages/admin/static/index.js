import React from "react";
import Dashboard from "../../../components/Dashboard";
import axios from "axios";
import { makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

const month = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤษจิกายน",
  "ธันวาคม",
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <>{children}</>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const Static = (props) => {
  const [chartData, steChartData] = React.useState(null);
  const [eventsSelect, setEventsSelect] = React.useState(null);
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  // List
  const [listOfRequest, setListOfRequest] = React.useState([]);

  // List Select
  const [listOfMonth, setListOfMonth] = React.useState([]);
  const [listOfVehicle, setListOfVehicle] = React.useState([]);
  const [listOfDriver, setListOfDriver] = React.useState([]);

  // List Select
  const [selectOfMonth, setselectOfMonth] = React.useState("");
  const [selectOfVehicle, setselectOfVehicle] = React.useState("");
  const [selectOfDriver, setselectOfDriver] = React.useState("");

  // Data Show
  const [listMonth, setListMonth] = React.useState([]);
  const [listVehicle, setListVehicle] = React.useState([]);
  const [listDriver, setListDriver] = React.useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // const getRequest = () => {
  //   axios
  //     .get(`${props.env.api_url}requestcar/getRequestChart`)
  //     .then((val) => {
  //       console.log(val.data);
  //       if (val.data.result.rowCount > 0) {
  //         let labels = [],
  //           dataset = [],
  //           data = [];

  //         [...val.data.result.result].forEach((e, i) => {
  //           labels.push(e.yt);
  //           dataset.push(`${e.data}`.split(",").length);
  //           data.push(
  //             `${e.data}`.split(",").map((e, i) => {
  //               return `${e}`.split("--");
  //             })
  //           );
  //         });

  //         steChartData({ labels: labels, dataset: dataset, data: data });
  //       } else {
  //         steChartData(null);
  //       }
  //     })
  //     .catch((reason) => {
  //       console.log(reason);
  //     });
  // };

  const getRequest = () => {
    let dateTmp = [];
    let dateSTR = "";
    let monthTMP = [];
    let vehicleTMP = [];
    let driverTMP = [];

    axios
      .post(`${props.env.api_url}requestcar/getRequest`)
      .then((val) => {
        if (val.data.result.rowCount > 0) {
          let data = [...val.data.result.result]
            .filter((e) => e.id_car != null)
            .map((ee) => {
              return {
                ...ee,
                distance: parseInt(
                  `${`${JSON.parse(ee.mapdata)?.distance}` ?? ""}`
                    .split(" ")
                    .shift()
                ),
              };
            });

          setListOfRequest(data);
          console.log(data);

          data.forEach((e, i) => {
            // Start Month
            dateTmp = `${e.date_start}`.split("-");
            dateSTR = `${month[parseInt(dateTmp[1]) - 1]} ${
              parseInt(dateTmp[0]) + 543
            }`;
            monthTMP.push(
              `${JSON.stringify({
                th: dateSTR,
                old: `${dateTmp[0]}-${dateTmp[1]}`,
              })}`
            );
            // End Month

            // Start Vehicle
            vehicleTMP.push(`${JSON.stringify(e.c_vehicle_type)}`);
            // End Vehicle

            // Start Driver
            driverTMP.push(`${JSON.stringify(e.user_driver_name)}`);
            // End Driver
          });

          setListOfMonth((prev) => {
            let mTmp = [...new Set(monthTMP)]
              .map((e) => JSON.parse(e))
              .filter((e) => e != null);
            return mTmp;
          });

          setListOfVehicle((prev) => {
            let vTmp = [...new Set(vehicleTMP)]
              .map((e) => JSON.parse(e))
              .filter((e) => e != null);
            return vTmp;
          });

          setListOfDriver((prev) => {
            let dTmp = [...new Set(driverTMP)]
              .map((e) => JSON.parse(e))
              .filter((e) => e != null);
            return dTmp;
          });
        } else {
        }
      })
      .catch((reason) => {
        console.log(reason);
      });
  };

  React.useEffect(() => {
    // let myChart = null;
    // if (chartData) {
    //   console.log(chartData);
    //   let canvas = document.getElementById("myChart").getContext("2d");
    //   myChart = new Chart(canvas, {
    //     type: "bar",
    //     data: {
    //       labels: chartData.labels,
    //       datasets: [
    //         {
    //           label: "สถิติการขอใช้",
    //           data: chartData.dataset,
    //           backgroundColor: "rgba(255, 99, 132, 0.2)",
    //           borderColor: "rgba(255, 99, 132, 1)",
    //           borderWidth: 1,
    //         },
    //       ],
    //     },
    //     options: {
    //       onClick: (...a) => {
    //         setEventsSelect((prve) => {
    //           if ([...a[1]].length > 0) return chartData.data[a[1][0]["index"]];
    //           else return prve;
    //         });
    //       },
    //       scales: {
    //         y: {
    //           beginAtZero: true,
    //         },
    //       },
    //     },
    //   });
    // }
    // return () => {
    //   myChart && myChart.destroy();
    // };
    // if (listOfMonth.length > 0) {
    //   console.log("listOfMonth", listOfMonth);
    // }
    // if (listOfVehicle.length > 0) {
    //   console.log("listOfVehicle", listOfVehicle);
    // }
    // if (listOfDriver.length > 0) {
    //   console.log("listOfDriver", listOfDriver);
    // }
  }, []);

  React.useEffect(() => {
    getRequest();
    return () => {};
  }, []);

  return (
    <Dashboard {...props}>
      {/* <div className="box-padding">
         <canvas id="myChart"></canvas>
        {(() => {
          if (eventsSelect) {
            return <table className="table table-sm table-borderless">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">สถานที่</th>
                  <th scope="col">ข้อมูลรถ</th>
                </tr>
              </thead>
              <tbody>
                {[...eventsSelect].map((e, i) => {
                  return <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{e[0]}</td>
                    <td>{`${e[1]}`.replace(/!!/g, ', ')}</td>
                  </tr>
                })}

              </tbody>
            </table>
          }
        })()} 
       
      </div> */}

      <div className={classes.root}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab label="รายเดือน" {...a11yProps(0)} />
            <Tab label="ประเภทยานพาหนะ" {...a11yProps(1)} />
            <Tab label="พนักงานขับยานพาหนะ" {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <React.Fragment>
            <div className="row">
              <div className="col-md-6  mb-3">
                <h4>สถิติการใช้ยานพาหนะ</h4>
                <p>รายเดือน</p>
              </div>
              <div className="col-md-6  mb-3">
                <div className="form-group">
                  <label htmlFor="exampleFormControlSelect1">เดือน</label>
                  <select
                    className="form-control"
                    id="exampleFormControlSelect1"
                    defaultValue={selectOfMonth}
                    onChange={(e) => {
                      e.preventDefault();
                      setselectOfMonth(e.target.value);
                      console.log(e.target.value);
                      setListMonth((prev) => {
                        let tmp = listOfRequest.filter(
                          (ee) =>
                            `${e.target.value}`.length > 0 &&
                            `${ee.date_start}`.includes(`${e.target.value}`)
                        );

                        console.log("listOfRequest", tmp);
                        return tmp;
                      });
                    }}
                  >
                    <option value="">โปรดเลือกรายการ</option>
                    {listOfMonth.map((e, i) => {
                      return (
                        <option key={i} value={e.old}>
                          {e.th}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            {/* const [listMonth, setListMonth] = React.useState([]);
            const [listVehicle, setListVehicle] = React.useState([]);
            const [listDriver, setListDriver] = React.useState([]); */}

            <h4>ข้อมูลสรุป</h4>
            <h6>
              <b>จำนวนการขอใช้ : </b>
              {listMonth.length}&nbsp;ครั้ง
            </h6>
            {(() => {
              if (listMonth.length > 0) {
                return (
                  <>
                    <h6 className="mb-3">
                      <b>ระยะทางทั้งหมด : </b>
                      {listMonth
                        .map((item) => item.distance)
                        .reduce((prev, next) => prev + next)}
                      &nbsp;กม.
                    </h6>
                  </>
                );
              } else {
                return (
                  <>
                    <h6 className="mb-3">
                      <b>ระยะทางทั้งหมด : </b>0 &nbsp;กม.
                    </h6>
                  </>
                );
              }
            })()}

            <table className="table table-sm table-striped table-bordered">
              <thead>
                <tr>
                  <th></th>
                  <th>สังกัด</th>
                  <th>สถานที่</th>
                  <th>ระยะทาง</th>
                  <th>ประเภท</th>
                  <th>ยี่ห้อ</th>
                  <th>รุ่น</th>
                  <th>ทะเบียน</th>
                </tr>
              </thead>
              <tbody>
                {listMonth.map((e, i) => {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{e.affiliation}</td>
                      <td>{e.location}</td>
                      <td>{e.distance}&nbsp;กม.</td>
                      <td>{e.c_vehicle_type}</td>
                      <td>{e.c_brand}</td>
                      <td>{e.c_model}</td>
                      <td>{e.c_registration_number}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </React.Fragment>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <React.Fragment>
            <div className="row">
              <div className="col-6">
                <h4>สถิติการใช้ยานพาหนะ</h4>
                <p>ประเภทยานพาหนะ</p>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label htmlFor="exampleFormControlSelect2">
                    ประเภทยานพาหนะ
                  </label>
                  <select
                    className="form-control"
                    id="exampleFormControlSelect2"
                    defaultValue={selectOfVehicle}
                    onChange={(e) => {
                      e.preventDefault();
                      console.log(e.target.value);
                      setselectOfVehicle(e.target.value);
                      setListVehicle((prev) => {
                        let tmp = listOfRequest.filter(
                          (ee) =>
                            `${e.target.value}`.length > 0 &&
                            `${ee.c_vehicle_type}`.includes(`${e.target.value}`)
                        );
                        console.log("listOfRequest", tmp);
                        return tmp;
                      });
                    }}
                  >
                    <option value="">โปรดเลือกรายการ</option>
                    {listOfVehicle.map((e, i) => {
                      return (
                        <option key={i} value={e}>
                          {e}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            <h4>ข้อมูลสรุป</h4>
            <h6>
              <b>จำนวนการขอใช้ : </b>
              {listVehicle.length}&nbsp;ครั้ง
            </h6>
            {(() => {
              if (listVehicle.length > 0) {
                return (
                  <>
                    <h6 className="mb-3">
                      <b>ระยะทางทั้งหมด : </b>
                      {listVehicle
                        .map((item) => item.distance)
                        .reduce((prev, next) => prev + next)}
                      &nbsp;กม.
                    </h6>
                  </>
                );
              } else {
                return (
                  <>
                    <h6 className="mb-3">
                      <b>ระยะทางทั้งหมด : </b>0 &nbsp;กม.
                    </h6>
                  </>
                );
              }
            })()}

            <table className="table table-sm table-striped table-bordered">
              <thead>
                <tr>
                  <th></th>
                  <th>สังกัด</th>
                  <th>สถานที่</th>
                  <th>ระยะทาง</th>
                  <th>ประเภท</th>
                  <th>ยี่ห้อ</th>
                  <th>รุ่น</th>
                  <th>ทะเบียน</th>
                </tr>
              </thead>
              <tbody>
                {listVehicle.map((e, i) => {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{e.affiliation}</td>
                      <td>{e.location}</td>
                      <td>{e.distance}&nbsp;กม.</td>
                      <td>{e.c_vehicle_type}</td>
                      <td>{e.c_brand}</td>
                      <td>{e.c_model}</td>
                      <td>{e.c_registration_number}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </React.Fragment>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <React.Fragment>
            <div className="row">
              <div className="col-6">
                <h4>สถิติการใช้ยานพาหนะ</h4>
                <p>พนักงานขับยานพาหนะ</p>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label htmlFor="exampleFormControlSelect3">
                    พนักงานขับยานพาหนะ
                  </label>
                  <select
                    className="form-control"
                    id="exampleFormControlSelect3"
                    defaultValue={selectOfDriver}
                    onChange={(e) => {
                      e.preventDefault();
                      console.log(e.target.value);
                      setselectOfDriver(e.target.value);
                      setListDriver((prev) => {
                        let tmp = listOfRequest.filter(
                          (ee) =>
                            `${e.target.value}`.length > 0 &&
                            `${ee.user_driver_name}`.includes(
                              `${e.target.value}`
                            )
                        );
                        console.log("listOfRequest", tmp);
                        return tmp;
                      });
                    }}
                  >
                    <option value="">โปรดเลือกรายการ</option>
                    {listOfDriver.map((e, i) => {
                      return (
                        <option key={i} value={e}>
                          {e}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            <h4>ข้อมูลสรุป</h4>
            <h6>
              <b>จำนวนการขอใช้ : </b>
              {listDriver.length}&nbsp;ครั้ง
            </h6>
            {(() => {
              if (listDriver.length > 0) {
                return (
                  <>
                    <h6 className="mb-3">
                      <b>ระยะทางทั้งหมด : </b>
                      {listDriver
                        .map((item) => item.distance)
                        .reduce((prev, next) => prev + next)}
                      &nbsp;กม.
                    </h6>
                  </>
                );
              } else {
                return (
                  <>
                    <h6 className="mb-3">
                      <b>ระยะทางทั้งหมด : </b>0 &nbsp;กม.
                    </h6>
                  </>
                );
              }
            })()}

            <table className="table table-sm table-striped table-bordered">
              <thead>
                <tr>
                  <th></th>
                  <th>สังกัด</th>
                  <th>สถานที่</th>
                  <th>ระยะทาง</th>
                  <th>ประเภท</th>
                  <th>ยี่ห้อ</th>
                  <th>รุ่น</th>
                  <th>ทะเบียน</th>
                </tr>
              </thead>
              <tbody>
                {listDriver.map((e, i) => {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{e.affiliation}</td>
                      <td>{e.location}</td>
                      <td>{e.distance}&nbsp;กม.</td>
                      <td>{e.c_vehicle_type}</td>
                      <td>{e.c_brand}</td>
                      <td>{e.c_model}</td>
                      <td>{e.c_registration_number}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </React.Fragment>
        </TabPanel>
      </div>

      <style jsx>{`
        #myChart {
          width: 100% !important;
          height: 600px !important;
        }
      `}</style>
    </Dashboard>
  );
};

export default Static;

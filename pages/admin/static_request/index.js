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
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectOfMonth, setselectOfMonth] = React.useState("");
  const [listMonth, setListMonth] = React.useState([]);
  const [listOfMonth, setListOfMonth] = React.useState([]);
  const [listOfRequest, setListOfRequest] = React.useState([]);
  const [filterOfMonth, setFilterOfMonth] = React.useState([]);

  const [listOfAffiliation, setListOfAffiliation] = React.useState([]);

  const [listOfLicensePlate, setListOfLicensePlate] = React.useState([]);

  const filterOfRequest = (key, value) => {
    return filterOfMonth.filter((el) => {
      return el[key] == value;
    });
  };

  const getRequest = () => {
    let dateTmp = [];
    let dateSTR = "";
    let monthTMP = [];
    let tmpOfaffiliation = [];
    let tmpLicensePlate = [];

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
            tmpOfaffiliation.push(e.affiliation);
            tmpLicensePlate.push(e.c_registration_number);
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
          });

          setListOfLicensePlate(() => {
            let set = [...new Set(tmpLicensePlate)];
            return set;
          });

          setListOfAffiliation(() => {
            let set = [...new Set(tmpOfaffiliation)];
            return set;
          });

          setListOfMonth((prev) => {
            let mTmp = [...new Set(monthTMP)]
              .map((e) => JSON.parse(e))
              .filter((e) => e != null);
            return mTmp;
          });
        }
      })
      .catch((reason) => {
        console.log(reason);
      });
  };

  React.useEffect(() => {
    getRequest();
  }, []);

  return (
    <Dashboard {...props}>
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab label="หน่วยงาน" {...a11yProps(0)} />
            <Tab label="ทะเบียนรถ" {...a11yProps(1)} />
          </Tabs>
        </AppBar>

        <TabPanel value={value} index={0}>
          <React.Fragment>
            <div className="row">
              <div className="col-md-6  mb-3">
                <h4>หน่วยงาน</h4>
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
                        setFilterOfMonth(() => {
                          return tmp;
                        });
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

            <table className="table table-sm table-striped table-bordered">
              <thead>
                <tr>
                  <th>สังกัด</th>
                  <th>ในจังหวัด</th>
                  <th>นอกจังหวัด</th>
                  <th>รวม</th>
                </tr>
              </thead>
              <tbody>
                {listOfAffiliation.map((el, i) => {
                  return (
                    <tr key={i}>
                      <td>{el}</td>
                      <td>
                        {
                          filterOfRequest("affiliation", el).filter((ex) => {
                            return ex.in_korat == "true";
                          }).length
                        }
                      </td>
                      <td>
                        {
                          filterOfRequest("affiliation", el).filter((ex) => {
                            return ex.in_korat != "true";
                          }).length
                        }
                      </td>
                      <td>
                        {filterOfRequest("affiliation", el).filter((ex) => {
                          return ex.in_korat == "true";
                        }).length +
                          filterOfRequest("affiliation", el).filter((ex) => {
                            return ex.in_korat != "true";
                          }).length}
                      </td>
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
              <div className="col-md-6  mb-3">
                <h4>ทะเบียนรถ</h4>
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
                        setFilterOfMonth(() => {
                          return tmp;
                        });
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

            <table className="table table-sm table-striped table-bordered">
              <thead>
                <tr>
                  <th>ทะเบียนรถ</th>
                  <th>ในจังหวัด</th>
                  <th>นอกจังหวัด</th>
                  <th>รวม</th>
                </tr>
              </thead>
              <tbody>
                {listOfLicensePlate.map((el, i) => {
                  return (
                    <tr key={i}>
                      <td>{el}</td>
                      <td>
                        {
                          filterOfRequest("c_registration_number", el).filter(
                            (ex) => {
                              return ex.in_korat == "true";
                            }
                          ).length
                        }
                      </td>
                      <td>
                        {
                          filterOfRequest("c_registration_number", el).filter(
                            (ex) => {
                              return ex.in_korat != "true";
                            }
                          ).length
                        }
                      </td>
                      <td>
                        {filterOfRequest("c_registration_number", el).filter(
                          (ex) => {
                            return ex.in_korat == "true";
                          }
                        ).length +
                          filterOfRequest("c_registration_number", el).filter(
                            (ex) => {
                              return ex.in_korat != "true";
                            }
                          ).length}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </React.Fragment>
        </TabPanel>
      </div>
    </Dashboard>
  );
};

export default Static;

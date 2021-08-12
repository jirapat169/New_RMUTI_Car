import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Dashboard from "../../components/Dashboard";
import axios from "axios";
import GGMap from "../../components/GGmap";
import GGMapDirection from "../../components/GGMapDirection";

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
  const [viewDetail, setViewDetail] = React.useState(null);

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
                  : `${e.mystep}` == "4" || `${e.mystep}` == "3"
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
          console.log(e.data);
          setViewDetail(e.data);
          $("#exampleViewDetailModal").modal("show");
        }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.color,
            color: "black",
          },
        })}
        style={{ height: 500 }}
      />

      <div
        className="modal fade"
        id="exampleViewDetailModal"
        tabIndex="-1"
        aria-labelledby="exampleViewDetailModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog  modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleViewDetailModalLabel">
                รายละเอียดการขอใช้ยานพาหนะ
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {(() => {
                if (viewDetail) {
                  return (
                    <div className="row">
                      <div className="col-md-6">
                        <h6>
                          <b>ชื่อผู้ขอใช้ : </b>
                          {viewDetail.user_request_name}
                        </h6>
                        <h6>
                          <b>สังกัด : </b>
                          {viewDetail.affiliation}
                        </h6>
                        <h6>
                          <b>เหตุผลการขอใช้ยานพาหนะ : </b>
                          {viewDetail.reason}
                        </h6>
                        <h6>
                          <b>สถานที่ : </b>
                          {viewDetail.location}
                        </h6>
                        <h6>
                          <b>จำนวนผู้ร่วมเดินทาง : </b>
                          {viewDetail.count_people}
                        </h6>
                        <h6>
                          <b>อาจารย์/เจ้าหน้าที่ : </b>
                          <ol style={{ margin: "unset" }}>
                            {`${viewDetail.list_teacher}`
                              .split(",")
                              .map((e, i) => {
                                return `${e}`.length > 0 ? (
                                  <li key={i}>{e}</li>
                                ) : (
                                  ""
                                );
                              })}
                          </ol>
                        </h6>
                        <h6>
                          <b>นักศึกษา : </b>
                          <ol style={{ margin: "unset" }}>
                            {`${viewDetail.list_student}`
                              .split(",")
                              .map((e, i) => {
                                return `${e}`.length > 0 ? (
                                  <li key={i}>{e}</li>
                                ) : (
                                  ""
                                );
                              })}
                          </ol>
                        </h6>
                        <h6>
                          <b>ระหว่างวันที่ : </b>
                          {viewDetail.date_start} ถึง {viewDetail.date_end}
                        </h6>
                        <h6>
                          <b>เวลาออกรถ : </b>
                          {viewDetail.car_start}
                        </h6>
                        <h6>
                          <b>เวลากลับ : </b>
                          {viewDetail.car_end}
                        </h6>

                        <h6 className="mt-3">
                          <b>สถานะ : </b>
                          {viewDetail.mystep == "0"
                            ? "รอการตรวจสอบจากเจ้าหน้าที่"
                            : viewDetail.mystep == "5"
                            ? "ยกเลิกการจอง"
                            : viewDetail.mystep == "1"
                            ? "รอการอนุมัติจากผู้อำนวยการกองกลาง"
                            : viewDetail.mystep == "2"
                            ? "รอการอนุมัติจากผู้มีอำนาจสั่งใช้ยานพาหนะ"
                            : viewDetail.mystep == "3"
                            ? "ผ่านอนุมัติ"
                            : viewDetail.mystep == "4"
                            ? "ส่งคืนยานพาหนะสำเร็จ"
                            : viewDetail.mystep}
                        </h6>
                        <h6>
                          <b>คนขับ : </b>
                          {viewDetail.user_driver_name}
                        </h6>
                        <h6>
                          <b>รถ : </b>
                          {viewDetail.c_brand}{" "}
                          {viewDetail.c_registration_number}
                        </h6>
                        <div className={"mb-3 mt-3"}>
                          {(() => {
                            if (`${viewDetail.doc1}`.length > 0) {
                              return (
                                <a
                                  href={viewDetail.doc1}
                                  download="เอกสารอนุมัติไปราชการ.pdf"
                                >
                                  <i className="fas fa-file-powerpoint"></i>{" "}
                                  เอกสารอนุมัติไปราชการ
                                </a>
                              );
                            } else {
                              return (
                                <b className="text-danger">
                                  ไม่พบเอกสารอนุมัติไปราชการ
                                </b>
                              );
                            }
                          })()}
                        </div>
                        <div>
                          {(() => {
                            if (`${viewDetail.doc2}`.length > 0) {
                              return (
                                <a
                                  href={viewDetail.doc2}
                                  download="เอกสารอนุญาติให้ใช้ยานพาหนะ.pdf"
                                >
                                  <i className="fas fa-file-powerpoint"></i>{" "}
                                  เอกสารอนุญาติให้ใช้ยานพาหนะ
                                </a>
                              );
                            } else {
                              return (
                                <b className="text-danger">
                                  ไม่พบเอกสารอนุญาติให้ใช้ยานพาหนะ
                                </b>
                              );
                            }
                          })()}
                        </div>
                      </div>

                      <div className="col-md-6">
                        {(() => {
                          if (JSON.parse(viewDetail.mapdata)["location"]) {
                            return (
                              <div className="mb-3">
                                <GGMapDirection
                                  {...props}
                                  location={
                                    JSON.parse(viewDetail.mapdata)["location"]
                                  }
                                />
                              </div>
                            );
                          }
                        })()}

                        <p style={{ margin: "unset" }}>
                          <b>จุดเริ่มต้น : </b>
                          {JSON.parse(viewDetail.mapdata)["start"]}
                        </p>
                        <p style={{ margin: "unset" }}>
                          <b>จุดสิ้นสุด : </b>
                          {JSON.parse(viewDetail.mapdata)["end"]}
                        </p>
                        <p style={{ margin: "unset" }}>
                          <b>ระยะทาง : </b>
                          {JSON.parse(viewDetail.mapdata)["distance"]}
                        </p>
                        <p style={{ margin: "unset" }}>
                          <b>ระยะเวลาการเดินทาง : </b>
                          {JSON.parse(viewDetail.mapdata)["time"]}
                        </p>
                        <p style={{ margin: "unset" }}>
                          <b>ค่าใช้จ่ายโดยประมาณ : </b>
                          {JSON.parse(viewDetail.mapdata)["cost"]}
                          <b>&nbsp;บาท</b>
                        </p>
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Home;

import React from "react";
import { useRouter } from "next/router";
import Dashboard from "../../../components/Dashboard";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Month from "../../../components/month";
import GGMap from "../../../components/GGmap";
import GGMapDirection from "../../../components/GGMapDirection";

pdfMake.fonts = {
  THSarabun: {
    normal: "THSarabun.ttf",
    bold: "THSarabun Bold.ttf",
    italics: "THSarabun Italic.ttf",
    bolditalics: "THSarabun Bold Italic.ttf",
  },
  Roboto: {
    normal: "Roboto-Regular.ttf",
    bold: "Roboto-Medium.ttf",
    italics: "Roboto-Italic.ttf",
    bolditalics: "Roboto-MediumItalic.ttf",
  },
};
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfMake.vfs;

const getBase64ImageFromURL = (url) => {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.setAttribute("crossOrigin", "anonymous");

    img.onload = () => {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      var dataURL = canvas.toDataURL("image/png");

      resolve(dataURL);
    };

    img.onerror = (error) => {
      reject(error);
    };

    img.src = url;
  });
};

const Admin = (props) => {
  const router = useRouter();
  const { control, handleSubmit, reset } = useForm();

  const [stateRequest, setRequest] = React.useState(true);

  const [reasonMessage, setReasonMessage] = React.useState("");
  const [request, setListRequest] = React.useState([]);
  const [selectRequest, setSelectRequest] = React.useState({});
  const [listCD, setListCD] = React.useState({ car: [], driver: [] });
  const [viewDetail, setViewDetail] = React.useState(null);

  const getRequest = () => {
    axios
      .post(`${props.env.api_url}requestcar/getRequest`)
      .then((val) => {
        console.log(val.data);
        if (val.data.result.rowCount > 0) {
          setListRequest(val.data.result.result);
          console.log(val.data.result.result);
        } else {
          setListRequest([]);
        }
      })
      .catch((reason) => {
        console.log(reason);
      });
  };

  React.useEffect(() => {
    // router.replace("/home");
    getRequest();
    $("#exampleViewDetailModal").on("hide.bs.modal", (event) => {
      setViewDetail(null);
    });
  }, []);

  const onSubmit = (data) => {
    let tmp = {
      ...data,
      step: "1",
      insertStatus: true,
      car_step_username: props.userLogin.username,
      car_step_status: "1",
      car_step_reason: "no",
      id_request: selectRequest.id,
    };

    axios
      .post(`${props.env.api_url}requestcar/managestep`, JSON.stringify(tmp))
      .then((val) => {
        console.log(val.data);
        getRequest();
        window.$(`#exampleModal`).modal("hide");
      })
      .catch((reason) => {
        console.log(reason);
      });
  };

  const onSubmitChangeCar = (data) => {
    let tmp = {
      car_detail_id_car: data.car_detail_id_car_update,
      car_detail_user_driver: selectRequest.user_driver,
      step: selectRequest.mystep,
      insertStatus: false,
      car_step_username: props.userLogin.username,
      car_step_status: "1",
      car_step_reason: "no",
      id_request: selectRequest.id,
    };

    axios
      .post(`${props.env.api_url}requestcar/managestep`, JSON.stringify(tmp))
      .then((val) => {
        console.log(val.data);
        getRequest();
        window.$(`#exampleModalCar`).modal("hide");
      })
      .catch((reason) => {
        console.log(reason);
      });
  };

  const onSubmitChangeDriver = (data) => {
    let tmp = {
      car_detail_id_car: selectRequest.id_car,
      car_detail_user_driver: data.car_detail_user_driver_update,
      step: selectRequest.mystep,
      insertStatus: false,
      car_step_username: props.userLogin.username,
      car_step_status: "1",
      car_step_reason: "no",
      id_request: selectRequest.id,
    };

    axios
      .post(`${props.env.api_url}requestcar/managestep`, JSON.stringify(tmp))
      .then((val) => {
        console.log(val.data);
        getRequest();
        window.$(`#exampleModalDriver`).modal("hide");
      })
      .catch((reason) => {
        console.log(reason);
      });
  };

  const cancelRequest = () => {
    let data = {
      step: "1",
      insertStatus: false,
      id_request: selectRequest.id,
      car_step_username: props.userLogin.username,
      car_step_status: "0",
      car_step_reason: reasonMessage,
    };

    // console.log(data);
    if (confirm("ยืนยันการยกเลิก")) {
      axios
        .post(`${props.env.api_url}requestcar/managestep`, JSON.stringify(data))
        .then((val) => {
          // console.log(val.data);
          window.location.reload();
          // getRequest();
        })
        .catch((reason) => {
          console.log(reason);
        });
    }
  };

  return (
    <Dashboard {...props}>
      <div className="box-padding">
        <div className="row">
          <div className="col-9 mb-3">
            <h2>รายการขอใช้ยานพาหนะ</h2>
          </div>
          <div className="col-3 mb-3">
            <div className="text-right"></div>
          </div>
        </div>

        <table className="table table-sm table-bordered">
          <thead>
            <tr>
              <th scope="col">วันที่ใช้รถ</th>
              <th scope="col">เหตุผล</th>
              <th scope="col">สถานที่</th>
              <th scope="col">สถานะ</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {request.map((e, i) => {
              return (
                <tr key={i}>
                  <td style={{ verticalAlign: "middle" }}>
                    {e.date_start} - {e.date_end}
                  </td>
                  <td style={{ verticalAlign: "middle" }}>{e.reason} </td>
                  <td style={{ verticalAlign: "middle" }}>{e.location} </td>
                  <td style={{ verticalAlign: "middle" }}>
                    {e.mystep == "0"
                      ? "รอการตรวจสอบจากเจ้าหน้าที่"
                      : e.mystep == "5"
                      ? "ยกเลิกการจอง"
                      : e.mystep == "1"
                      ? "รอการอนุมัติจากผู้อำนวยการกองกลาง"
                      : e.mystep == "2"
                      ? "รอการอนุมัติจากผู้มีอำนาจสั่งใช้ยานพาหนะ"
                      : e.mystep == "3"
                      ? "ผ่านอนุมัติ"
                      : e.mystep == "4"
                      ? "ส่งคืนยานพาหนะสำเร็จ"
                      : e.mystep}{" "}
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    <button
                      type="button"
                      className="btn btn-primary mr-2 btn-sm"
                      data-toggle="modal"
                      data-target="#exampleViewDetailModal"
                      onClick={() => {
                        setViewDetail(e);
                      }}
                    >
                      <i className="fas fa-search-plus"></i>
                    </button>

                    {(() => {
                      if (parseInt(e.mystep) == 0) {
                        return (
                          <button
                            type="button"
                            className="btn btn-warning btn-sm ml-2 mr-2"
                            data-toggle="modal"
                            data-target="#exampleModal"
                            disabled={e.mystep == "5"}
                            onClick={() => {
                              setSelectRequest(e);
                              axios
                                .post(
                                  `${props.env.api_url}carstock/getUsableCarNDriver`,
                                  JSON.stringify({
                                    date_start: e.date_start,
                                    date_end: e.date_end,
                                  })
                                )
                                .then((val) => {
                                  console.log(val.data);
                                  setListCD({
                                    car: [...val.data.resultcar.result].filter(
                                      (e) => e.delete_at == null
                                    ),
                                    driver: val.data.resultdriver.result,
                                  });
                                })
                                .catch((reason) => {
                                  console.log(reason);
                                });
                            }}
                          >
                            เลือกรถและคนขับ
                          </button>
                        );
                      } else {
                        return (
                          <>
                            <button
                              type="button"
                              className="btn btn-warning btn-sm ml-2 mr-2"
                              data-toggle="modal"
                              data-target="#exampleModalDriver"
                              disabled={e.mystep == "5"}
                              onClick={() => {
                                setSelectRequest(e);
                                axios
                                  .post(
                                    `${props.env.api_url}carstock/getUsableCarNDriver`,
                                    JSON.stringify({
                                      date_start: e.date_start,
                                      date_end: e.date_end,
                                    })
                                  )
                                  .then((val) => {
                                    console.log(val.data);
                                    setListCD({
                                      car: [
                                        ...val.data.resultcar.result,
                                      ].filter((e) => e.delete_at == null),
                                      driver: val.data.resultdriver.result,
                                    });
                                  })
                                  .catch((reason) => {
                                    console.log(reason);
                                  });
                              }}
                            >
                              เปลี่ยนพนักกงาน
                            </button>

                            <button
                              type="button"
                              className="btn btn-warning btn-sm ml-2 mr-2"
                              data-toggle="modal"
                              data-target="#exampleModalCar"
                              disabled={e.mystep == "5"}
                              onClick={() => {
                                setSelectRequest(e);
                                axios
                                  .post(
                                    `${props.env.api_url}carstock/getUsableCarNDriver`,
                                    JSON.stringify({
                                      date_start: e.date_start,
                                      date_end: e.date_end,
                                    })
                                  )
                                  .then((val) => {
                                    console.log(val.data);
                                    setListCD({
                                      car: [
                                        ...val.data.resultcar.result,
                                      ].filter((e) => e.delete_at == null),
                                      driver: val.data.resultdriver.result,
                                    });
                                  })
                                  .catch((reason) => {
                                    console.log(reason);
                                  });
                              }}
                            >
                              เปลี่ยนยานพาหนะ
                            </button>
                          </>
                        );
                      }
                    })()}

                    <button
                      type="button"
                      className="btn btn-danger btn-sm ml-2"
                      data-toggle="modal"
                      data-target="#exampleModalCancle"
                      disabled={e.mystep == "5"}
                      onClick={() => {
                        setSelectRequest(e);
                      }}
                    >
                      ยกเลิกการขอใช้
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* <!-- Modal Cancle Request --> */}
      <div
        className="modal fade"
        id="exampleModalCancle"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                ยกเลิกการขอใช้
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
              <div className="form-group">
                <label htmlFor="exampleFormControlTextarea1Cancle">
                  เหตุผลการยกเลิก
                </label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1Cancle"
                  onKeyUp={(e) => {
                    e.preventDefault();
                    setReasonMessage(e.target.value);
                    if (e.keyCode === 13 && reasonMessage.length > 0) {
                      cancelRequest();
                    }
                  }}
                  rows="3"
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                className="btn btn-danger"
                disabled={reasonMessage.length <= 0}
                onClick={() => {
                  cancelRequest();
                }}
              >
                ยืนยันการยกเลิก
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  อนุมัติการขอใช้
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
                จำนวนผู้โดยสาร{` ${selectRequest.count_people} `}คน
                <Controller
                  control={control}
                  name="car_detail_id_car"
                  defaultValue={""}
                  render={({ field, value, onChange }) => (
                    <TextField
                      {...field}
                      label="รายการรถที่ว่าง"
                      value={value}
                      select
                      onChange={onChange}
                      margin="normal"
                      required
                      fullWidth
                    >
                      <MenuItem value={""}>--- โปรดเลือก ---</MenuItem>
                      {listCD.car
                        .filter(
                          (ef) =>
                            parseInt(ef.seat_size) >=
                            parseInt(selectRequest.count_people)
                        )
                        .map((e, i) => {
                          return (
                            <MenuItem value={e.id} key={i}>
                              {e.brand} {e.model} จำนวน {e.seat_size} ที่นั่ง
                            </MenuItem>
                          );
                        })}
                    </TextField>
                  )}
                />
                <Controller
                  control={control}
                  name="car_detail_user_driver"
                  defaultValue={""}
                  render={({ field, value, onChange }) => (
                    <TextField
                      {...field}
                      label="รายชื่อคนขับที่ว่าง"
                      value={value}
                      select
                      onChange={onChange}
                      margin="normal"
                      required
                      fullWidth
                    >
                      <MenuItem value={""}>--- โปรดเลือก ---</MenuItem>
                      {listCD.driver.map((e, i) => {
                        return (
                          <MenuItem value={e.username} key={i}>
                            {e.prename}
                            {e.firstname} {e.lastname}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  )}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  ปิด
                </button>
                <button type="submit" className="btn btn-primary">
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="exampleModalDriver"
        tabIndex="-1"
        aria-labelledby="exampleModalDriverLabel"
        aria-hidden="true"
      >
        <form onSubmit={handleSubmit(onSubmitChangeDriver)} autoComplete="off">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalDriverLabel">
                  เปลี่ยนพนักกงานขับยานพาหนะ
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
                <Controller
                  control={control}
                  name="car_detail_user_driver_update"
                  defaultValue={""}
                  render={({ field, value, onChange }) => (
                    <TextField
                      {...field}
                      label="รายชื่อคนขับที่ว่าง"
                      value={value}
                      select
                      onChange={onChange}
                      margin="normal"
                      required
                      fullWidth
                    >
                      <MenuItem value={""}>--- โปรดเลือก ---</MenuItem>
                      {listCD.driver.map((e, i) => {
                        return (
                          <MenuItem value={e.username} key={i}>
                            {e.prename}
                            {e.firstname} {e.lastname}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  )}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  ปิด
                </button>
                <button type="submit" className="btn btn-primary">
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="exampleModalCar"
        tabIndex="-1"
        aria-labelledby="exampleModalCarLabel"
        aria-hidden="true"
      >
        <form onSubmit={handleSubmit(onSubmitChangeCar)} autoComplete="off">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalCarLabel">
                  เปลี่ยนยานพาหนะ
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
                จำนวนผู้โดยสาร{` ${selectRequest.count_people} `}คน
                <Controller
                  control={control}
                  name="car_detail_id_car_update"
                  defaultValue={""}
                  render={({ field, value, onChange }) => (
                    <TextField
                      {...field}
                      label="รายการรถที่ว่าง"
                      value={value}
                      select
                      onChange={onChange}
                      margin="normal"
                      required
                      fullWidth
                    >
                      <MenuItem value={""}>--- โปรดเลือก ---</MenuItem>
                      {listCD.car
                        .filter(
                          (ef) =>
                            parseInt(ef.seat_size) >=
                            parseInt(selectRequest.count_people)
                        )
                        .map((e, i) => {
                          return (
                            <MenuItem value={e.id} key={i}>
                              {e.brand} {e.model} จำนวน {e.seat_size} ที่นั่ง
                            </MenuItem>
                          );
                        })}
                    </TextField>
                  )}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  ปิด
                </button>
                <button type="submit" className="btn btn-primary">
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div
        className="modal fade"
        id="exampleViewDetailModal"
        tabIndex="-1"
        aria-labelledby="exampleViewDetailModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
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
              <div className="row">
                <div className="col-md-6 mb-3">
                  {(() => {
                    if (viewDetail) {
                      return (
                        <>
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
                                  return <li key={i}>{e}</li>;
                                })}
                            </ol>
                          </h6>
                          <h6>
                            <b>นักศึกษา : </b>
                            <ol style={{ margin: "unset" }}>
                              {`${viewDetail.list_student}`
                                .split(",")
                                .map((e, i) => {
                                  return <li key={i}>{e}</li>;
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
                        </>
                      );
                    }
                  })()}

                  <button
                    className="btn btn-success btn-sm mt-3"
                    onClick={async () => {
                      var docDefinition = {
                        pageSize: "A4",
                        pageOrientation: "portrait",
                        content: [
                          {
                            text: "ใบขออนุญาตใช้รถราชการ",
                            style: "header",
                            alignment: "center",
                            bold: true,
                            fontSize: 18,
                          },
                          {
                            text: `วันที่  ${
                              viewDetail.timestamp.split(" ")[0].split("-")[2]
                            }  เดือน  ${
                              Month()[
                                parseInt(
                                  viewDetail.timestamp
                                    .split(" ")[0]
                                    .split("-")[1]
                                ) - 1
                              ]
                            }  พ.ศ.${
                              parseInt(
                                viewDetail.timestamp.split(" ")[0].split("-")[0]
                              ) + 543
                            }`,
                            alignment: "right",
                            margin: [0, 0, 0, 14],
                          },
                          {
                            text: [
                              { text: "เรียน ", bold: true },
                              `   Mr.PDF   `,
                            ],
                            margin: [0, 0, 0, 14],
                          },
                          {
                            text: [
                              {
                                text: ` `,
                              },
                              {
                                text: `          ข้าพเจ้า`,
                                bold: false,
                              },
                              {
                                text: `   ${viewDetail.user_request_name}   `,
                                style: "underline",
                              },
                              {
                                text: `ตำแหน่ง`,
                                bold: false,
                              },
                              {
                                text: `   ${viewDetail.user_request_position}   `,
                                style: "underline",
                              },

                              {
                                text: `ขออนุญาตใช้รถราชการเพื่อ`,
                                bold: false,
                              },
                              {
                                text: `   ${viewDetail.reason}   `,
                                style: "underline",
                              },
                              {
                                text: `สถานที่`,
                                bold: false,
                              },
                              {
                                text: `   ${viewDetail.location}   `,
                                style: "underline",
                              },
                              {
                                text: `จำนวนผู้ร่วมเดินทาง`,
                                bold: false,
                              },
                              {
                                text: `   ${viewDetail.count_people}   `,
                                style: "underline",
                              },
                              {
                                text: `อาจารย์/เจ้าหน้าที่`,
                                bold: false,
                              },
                              {
                                text: `   ${
                                  viewDetail.list_teacher.split(",").length
                                }   `,
                                style: "underline",
                              },
                              {
                                text: `ได้แก่`,
                                bold: false,
                              },
                              {
                                text: `   ${viewDetail.list_teacher.split(
                                  ","
                                )}   `,
                                style: "underline",
                              },
                              {
                                text: `นักศึกษา`,
                                bold: false,
                              },
                              {
                                text: `   ${
                                  viewDetail.list_student.split(",").length
                                }   `,
                                style: "underline",
                              },
                              {
                                text: `ได้แก่`,
                                bold: false,
                              },
                              {
                                text: `   ${viewDetail.list_student.split(
                                  ","
                                )}   `,
                                style: "underline",
                              },
                              {
                                text: `ในวันที่`,
                                bold: false,
                              },
                              {
                                text: `   ${
                                  viewDetail.date_start.split("-")[2]
                                }   `,
                                style: "underline",
                              },
                              {
                                text: `เดือน`,
                                bold: false,
                              },
                              {
                                text: `   ${
                                  Month()[
                                    parseInt(
                                      viewDetail.date_start.split("-")[1]
                                    ) - 1
                                  ]
                                }   `,
                                style: "underline",
                              },
                              {
                                text: `พ.ศ.`,
                                bold: false,
                              },
                              {
                                text: `   ${
                                  parseInt(
                                    viewDetail.date_start.split("-")[0]
                                  ) + 543
                                }   `,
                                style: "underline",
                              },
                              {
                                text: `ถึงวันที่`,
                                bold: false,
                              },
                              {
                                text: `   ${
                                  viewDetail.date_end.split("-")[2]
                                }   `,
                                style: "underline",
                              },
                              {
                                text: `เดือน`,
                                bold: false,
                              },
                              {
                                text: `   ${
                                  Month()[
                                    parseInt(
                                      viewDetail.date_end.split("-")[1]
                                    ) - 1
                                  ]
                                }   `,
                                style: "underline",
                              },
                              {
                                text: `พ.ศ.`,
                                bold: false,
                              },
                              {
                                text: `   ${
                                  parseInt(viewDetail.date_end.split("-")[0]) +
                                  543
                                }   `,
                                style: "underline",
                              },
                            ],
                            margin: [0, 0, 0, 14],
                          },
                          {
                            image: `user_signature`,
                            width: 100,
                            alignment: "right",
                          },
                          {
                            text: [
                              {
                                text: `   ${viewDetail.user_request_name}   `,
                                style: "underline",
                              },
                              `   ผู้ขออนุญาต   `,
                            ],
                            alignment: "right",
                            margin: [0, 0, 0, 14],
                          },
                          {
                            layout: "lightHorizontalLines",
                            table: {
                              widths: ["*", "auto", 100, "*"],
                              body: [
                                ["", "", "", ""],
                                ["", "", "", ""],
                              ],
                            },
                          },
                          {
                            layout: "noBorders",
                            table: {
                              widths: ["*", "*"],
                              body: [
                                [
                                  {
                                    image: `signature_1`,
                                    width: 100,
                                    alignment: "center",
                                  },
                                  {
                                    image: `signature_2`,
                                    width: 100,
                                    alignment: "center",
                                  },
                                ],
                                [
                                  {
                                    text: [
                                      {
                                        text: `   ${viewDetail.step1_name}   `,
                                        style: "underline",
                                      },
                                      `   ผู้ตรวจสอบ   `,
                                    ],
                                    alignment: "center",
                                  },
                                  {
                                    text: [
                                      {
                                        text: `   ${viewDetail.step2_name}   `,
                                        style: "underline",
                                      },
                                      `   ผู้ตรวจสอบ   `,
                                    ],
                                    alignment: "center",
                                  },
                                ],
                              ],
                            },
                          },
                          {
                            layout: "lightHorizontalLines",
                            table: {
                              widths: ["*", "auto", 100, "*"],
                              body: [
                                ["", "", "", ""],
                                ["", "", "", ""],
                              ],
                            },
                          },
                          {
                            image: `signature_3`,
                            width: 100,
                            alignment: "center",
                          },
                          {
                            text: [
                              {
                                text: `   ${viewDetail.step3_name}   `,
                                style: "underline",
                              },
                              `   ผู้มีอำนาจสั่งใช้รถ   `,
                            ],
                            alignment: "center",
                            margin: [0, 0, 0, 14],
                          },
                        ],
                        defaultStyle: {
                          font: "THSarabun",
                          fontSize: 16,
                        },
                        styles: {
                          underline: {
                            decoration: "underline",
                            decorationStyle: "dotted",
                            decorationColor: "gray",
                            margin: 5,
                          },
                        },
                        images: {
                          user_signature: `${
                            viewDetail.user_signature
                              ? `${viewDetail.user_signature}`.length > 0
                                ? viewDetail.user_signature
                                : props.env.imageWhite
                              : props.env.imageWhite
                          }`,
                          signature_1: `${
                            viewDetail.step1_signature
                              ? `${viewDetail.step1_signature}`.length > 0
                                ? viewDetail.step1_signature
                                : props.env.imageWhite
                              : props.env.imageWhite
                          }`,
                          signature_2: `${
                            viewDetail.step2_signature
                              ? `${viewDetail.step2_signature}`.length > 0
                                ? viewDetail.step2_signature
                                : props.env.imageWhite
                              : props.env.imageWhite
                          }`,
                          signature_3: `${
                            viewDetail.step3_signature
                              ? `${viewDetail.step3_signature}`.length > 0
                                ? viewDetail.step3_signature
                                : props.env.imageWhite
                              : props.env.imageWhite
                          }`,
                        },
                      };
                      pdfMake.createPdf(docDefinition).open();
                    }}
                  >
                    Export PDF
                  </button>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="row">
                    <div className="col-6 mb-3">
                      <h5>คำนวนค่าใช้จ่าย</h5>
                    </div>
                  </div>

                  {(() => {
                    if (viewDetail) {
                      return (
                        <>
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
                        </>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Admin;

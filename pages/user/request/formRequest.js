import React from "react";
import { useForm, Controller } from "react-hook-form";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import GGMap from "../../../components/GGmap";
import GGMapDirection from "../../../components/GGMapDirection";

const FormRequest = (props) => {
  // console.log("props -> ", props);
  console.log(props.onInsertRequest);
  const lsST = props.onInsertRequest
    ? ""
    : `${props.defaultValue.list_student}`.length > 0
    ? `${props.defaultValue.list_student}`.split(",")
    : [];

  const lsTA = props.onInsertRequest
    ? ""
    : `${props.defaultValue.list_teacher}`.length > 0
    ? `${props.defaultValue.list_teacher}`.split(",")
    : [];

  const { control, handleSubmit, reset, setValue } = useForm(
    props.defaultValue
  );
  const [defaultValue, setDefaultValue] = React.useState(props.defaultValue);

  const [listTeacher, setListTeacher] = React.useState(
    props.onInsertRequest ? [] : lsTA.length > 0 ? lsTA.map((e, i) => i) : []
  );
  const [listStudent, setListStudent] = React.useState(
    props.onInsertRequest ? [] : lsST.length > 0 ? lsST.map((e, i) => i) : []
  );

  const [counterTeacher, setCounterTeacher] = React.useState(lsTA.length);
  const [counterStudent, setCounterStudent] = React.useState(lsST.length);
  const [doc1, setDoc1] = React.useState(props.defaultValue.doc1);
  const [doc2, setDoc2] = React.useState(props.defaultValue.doc2);
  const [mapData, setMapData] = React.useState(props.defaultValue.mapdata);

  const [dateStart, setDateStart] = React.useState(
    `${props.defaultValue.date_start}`.length > 0
      ? props.defaultValue.date_start
      : ""
  );

  const onSubmit = (data) => {
    if (mapData.length <= 0) {
      alert("โปรดคำนวนค่าใช้จ่าย");
      return;
    }

    if (`${doc1}`.length <= 0 || `${doc2}`.length <= 0) {
      alert("โปรดแนบเอกสารให้ครบถ้วน");
      return;
    }

    let tmp = {
      id: props.onInsertRequest ? "" : props.defaultValue.id,
      insertStatus: props.onInsertRequest,
      list_student: data.list_student ? [...data.list_student].join() : "",
      list_teacher: data.list_teacher ? [...data.list_teacher].join() : "",
      doc1: doc1,
      doc2: doc2,
      username: props.userLogin.username,
      mapdata: mapData,
    };
    data = { ...data, ...tmp };

    axios
      .post(`${props.env.api_url}requestcar/request`, JSON.stringify(data))
      .then((val) => {
        // console.log(val.data);
        props.getRequest();
        window.$(`#formCarModal`).modal("hide");
        window.location.reload();
      })
      .catch((reason) => {
        console.log(reason);
      });
  };

  React.useEffect(() => {
    setMapData(props.defaultValue.mapdata);
    setDefaultValue(props.defaultValue);
    setListTeacher(props.onInsertRequest ? [] : lsTA.map((e, i) => i));
    setListStudent(props.onInsertRequest ? [] : lsST.map((e, i) => i));
    setCounterTeacher(lsTA.length);
    setCounterStudent(lsST.length);
    setDoc1(props.defaultValue.doc1);
    setDoc2(props.defaultValue.doc2);
    setDateStart(
      `${props.defaultValue.date_start}`.length > 0
        ? props.defaultValue.date_start
        : ""
    );
    reset({
      ...props.defaultValue,
      list_student: props.onInsertRequest
        ? ""
        : `${props.defaultValue.list_student}`.split(","),
      list_teacher: props.onInsertRequest
        ? ""
        : `${props.defaultValue.list_teacher}`.split(","),
    });
  }, [props.defaultValue]);

  return (
    <React.Fragment>
      <div
        className="modal fade"
        id="formCarModal"
        tabIndex="-1"
        aria-labelledby="formCarModalLabel"
        aria-hidden="true"
      >
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="formCarModalLabel">
                  ข้อมูล
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
                  <div className="col-lg-6 mb-3">
                    <Controller
                      render={({ field, value, onChange }) => (
                        <TextField
                          {...field}
                          label="จุดประสงค์ในการขอใช้ยานพาหนะ"
                          onChange={onChange}
                          value={value}
                          margin="normal"
                          required
                          fullWidth
                        />
                      )}
                      control={control}
                      name="reason"
                      defaultValue={defaultValue.reason}
                    />

                    <Controller
                      render={({ field, value, onChange }) => (
                        <TextField
                          {...field}
                          label="สถานที่"
                          onChange={onChange}
                          value={value}
                          margin="normal"
                          required
                          fullWidth
                        />
                      )}
                      control={control}
                      name="location"
                      defaultValue={defaultValue.location}
                    />

                    <Controller
                      render={({ field, value, onChange }) => (
                        <TextField
                          type="date"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          {...field}
                          label="วันที่ต้องการใช้ยานพาหนะ"
                          onChange={(e) => {
                            onChange(e);
                            setDateStart(e.target.value);
                            setValue("date_end", "");
                          }}
                          value={value}
                          margin="normal"
                          required
                          fullWidth
                        />
                      )}
                      control={control}
                      name="date_start"
                      defaultValue={defaultValue.date_start}
                    />

                    <Controller
                      render={({ field, value, onChange }) => (
                        <TextField
                          type="date"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          {...field}
                          disabled={`${dateStart}`.length == 0}
                          label="วันที่นำยานพาหนะส่งคืน"
                          onChange={onChange}
                          value={value}
                          margin="normal"
                          required
                          fullWidth
                          inputProps={{
                            min: dateStart,
                          }}
                        />
                      )}
                      control={control}
                      name="date_end"
                      defaultValue={defaultValue.date_end}
                    />

                    <Controller
                      render={({ field, value, onChange }) => (
                        <TextField
                          id="time"
                          label="เวลานำยานพาหนะออกใช้งาน"
                          type="time"
                          onChange={(e) => {
                            onChange(e);
                          }}
                          value={value}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            step: 300, // 5 min
                          }}
                          margin="normal"
                          {...field}
                          required
                          fullWidth
                        />
                      )}
                      control={control}
                      name="car_start"
                      defaultValue={defaultValue.car_start}
                    />

                    <Controller
                      render={({ field, value, onChange }) => (
                        <TextField
                          id="time"
                          label="เวลานำยานพาหนะส่งคืน"
                          type="time"
                          onChange={onChange}
                          value={value}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            step: 300, // 5 min
                          }}
                          margin="normal"
                          {...field}
                          required
                          fullWidth
                        />
                      )}
                      control={control}
                      name="car_end"
                      defaultValue={defaultValue.car_end}
                    />
                  </div>
                  <div className="col-lg-6 mb-3">
                    <Controller
                      render={({ field, value, onChange }) => (
                        <TextField
                          {...field}
                          label="จำนวนผู้ร่วมเดินทาง"
                          onChange={onChange}
                          value={value}
                          margin="normal"
                          required
                          fullWidth
                        />
                      )}
                      control={control}
                      name="count_people"
                      defaultValue={defaultValue.count_people}
                    />

                    <div className="form-check mt-3">
                      <Controller
                        render={({ field, value, onChange }) => (
                          <input
                            {...field}
                            className="form-check-input"
                            type="checkbox"
                            checked={defaultValue.in_korat == "true"}
                            value={value}
                            disabled={!props.onInsertRequest}
                            onChange={(e) => {
                              e.target.value = `${e.target.checked}`;
                              onChange(e);
                              setDefaultValue((prev) => {
                                return {
                                  ...prev,
                                  in_korat: `${e.target.checked}`,
                                };
                              });
                            }}
                          />
                        )}
                        control={control}
                        name="in_korat"
                        defaultValue={defaultValue.in_korat == "true"}
                      />

                      <label
                        className="form-check-label"
                        htmlFor="defaultCheck1"
                      >
                        ใช้ในพื้นที่จังหวัดนครราชสีมา
                      </label>
                    </div>

                    <table className="table table-sm table-borderless">
                      <thead>
                        <tr>
                          <th scope="col" style={{ width: "100%" }}>
                            รายชื่ออาจารย์หรือเจ้าหน้าที่
                          </th>
                          <th scope="col">
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                setListTeacher((prevIndexes) => [
                                  ...prevIndexes,
                                  counterTeacher,
                                ]);
                                setCounterTeacher(
                                  (prevCounter) => prevCounter + 1
                                );
                              }}
                            >
                              เพิ่ม
                            </button>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {listTeacher.map((index) => {
                          const fieldName = `list_teacher[${index}]`;
                          return (
                            <tr key={index}>
                              <td>
                                <Controller
                                  render={({ field, value, onChange }) => (
                                    <input
                                      {...field}
                                      type="text"
                                      className="form-control"
                                      onChange={onChange}
                                      value={value}
                                      required
                                    ></input>
                                  )}
                                  control={control}
                                  name={fieldName}
                                  defaultValue={""}
                                />
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() => {
                                    setListTeacher((prevIndexes) => [
                                      ...prevIndexes.filter(
                                        (item) => item !== index
                                      ),
                                    ]);
                                    setCounterTeacher(
                                      (prevCounter) => prevCounter - 1
                                    );
                                  }}
                                >
                                  ลบ
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <table className="table table-sm table-borderless">
                      <thead>
                        <tr>
                          <th scope="col" style={{ width: "100%" }}>
                            รายชื่อนักศึกษา
                          </th>
                          <th scope="col">
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                setListStudent((prevIndexes) => [
                                  ...prevIndexes,
                                  counterStudent,
                                ]);
                                setCounterStudent(
                                  (prevCounter) => prevCounter + 1
                                );
                              }}
                            >
                              เพิ่ม
                            </button>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {listStudent.map((index) => {
                          const fieldName = `list_student[${index}]`;
                          return (
                            <tr key={index}>
                              <td>
                                <Controller
                                  render={({ field, value, onChange }) => (
                                    <input
                                      {...field}
                                      type="text"
                                      className="form-control"
                                      onChange={onChange}
                                      value={value}
                                      required
                                    ></input>
                                  )}
                                  control={control}
                                  name={fieldName}
                                  defaultValue={""}
                                />
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() => {
                                    setListStudent((prevIndexes) => [
                                      ...prevIndexes.filter(
                                        (item) => item !== index
                                      ),
                                    ]);
                                    setCounterStudent(
                                      (prevCounter) => prevCounter - 1
                                    );
                                  }}
                                >
                                  ลบ
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <div className="mt-3">
                      <input
                        type="file"
                        id="doc1"
                        accept="application/pdf"
                        onChange={async (e) => {
                          e.preventDefault();
                          let tmp = [...e.target.files];
                          e.target.value = "";

                          const toBase64 = (file) =>
                            new Promise((resolve, reject) => {
                              const reader = new FileReader();
                              reader.readAsDataURL(file);
                              reader.onload = () => resolve(reader.result);
                              reader.onerror = (error) => reject(error);
                            });

                          let img = await toBase64(tmp[0]);

                          setDoc1(img);
                        }}
                        style={{ display: "none" }}
                      />

                      <input
                        type="file"
                        id="doc2"
                        accept="application/pdf"
                        onChange={async (e) => {
                          e.preventDefault();
                          let tmp = [...e.target.files];
                          e.target.value = "";

                          const toBase64 = (file) =>
                            new Promise((resolve, reject) => {
                              const reader = new FileReader();
                              reader.readAsDataURL(file);
                              reader.onload = () => resolve(reader.result);
                              reader.onerror = (error) => reject(error);
                            });

                          let img = await toBase64(tmp[0]);

                          setDoc2(img);
                        }}
                        style={{ display: "none" }}
                      />

                      <table className="table table-sm table-borderless">
                        <thead>
                          <tr>
                            <th scope="col" style={{ width: "50%" }}>
                              เอกสาร
                            </th>
                            <th scope="col"></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ verticalAlign: "middle" }}>
                              {(() => {
                                if (`${doc1}`.length > 0) {
                                  return (
                                    <a
                                      href={doc1}
                                      download="เอกสารอนุมัติไปราชการ.pdf"
                                    >
                                      <i className="fas fa-file-powerpoint"></i>{" "}
                                      เอกสารอนุมัติไปราชการ
                                    </a>
                                  );
                                } else {
                                  return "ยังไม่มีเอกสาร";
                                }
                              })()}
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                  document.getElementById("doc1").click();
                                }}
                              >
                                เลือกเอกสารอนุมัติไปราชการ
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ verticalAlign: "middle" }}>
                              {(() => {
                                if (`${doc2}`.length > 0) {
                                  return (
                                    <a
                                      href={doc2}
                                      download="เอกสารอนุญาติให้ใช้ยานพาหนะ.pdf"
                                    >
                                      <i className="fas fa-file-powerpoint"></i>{" "}
                                      เอกสารอนุญาติให้ใช้ยานพาหนะ
                                    </a>
                                  );
                                } else {
                                  return "ยังไม่มีเอกสาร";
                                }
                              })()}
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                  document.getElementById("doc2").click();
                                }}
                              >
                                เลือกเอกสารอนุญาติให้ใช้ยานพาหนะ
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    {(() => {
                      if (mapData.length <= 0) {
                        return (
                          <GGMap
                            {...props}
                            dataGGmap={(e) => {
                              setMapData(JSON.stringify(e));
                            }}
                          />
                        );
                      } else {
                        return (
                          <div>
                            <div className="row">
                              <div className="col-6 mb-3">
                                <div className="row">
                                  <div className="col-6">
                                    <h5>คำนวนค่าใช้จ่าย</h5>
                                  </div>
                                  <div className="col-6 text-right">
                                    <button
                                      type="button"
                                      className="btn btn-warning btn-sm"
                                      onClick={() => {
                                        setMapData("");
                                      }}
                                    >
                                      แก้ไข
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {(() => {
                              if (JSON.parse(mapData)["location"]) {
                                return (
                                  <div className="mb-3">
                                    <GGMapDirection
                                      {...props}
                                      location={JSON.parse(mapData)["location"]}
                                    />
                                  </div>
                                );
                              }
                            })()}

                            <p style={{ margin: "unset" }}>
                              <b>จุดเริ่มต้น : </b>
                              {JSON.parse(mapData)["start"]}
                            </p>
                            <p style={{ margin: "unset" }}>
                              <b>จุดสิ้นสุด : </b>
                              {JSON.parse(mapData)["end"]}
                            </p>
                            <p style={{ margin: "unset" }}>
                              <b>ระยะทาง : </b>
                              {JSON.parse(mapData)["distance"]}
                            </p>
                            <p style={{ margin: "unset" }}>
                              <b>ระยะเวลาการเดินทาง : </b>
                              {JSON.parse(mapData)["time"]}
                            </p>
                            <p style={{ margin: "unset" }}>
                              <b>ค่าใช้จ่ายโดยประมาณ : </b>
                              {JSON.parse(mapData)["cost"]}
                            </p>
                          </div>
                        );
                      }
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
    </React.Fragment>
  );
};

export default FormRequest;

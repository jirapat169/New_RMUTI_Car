import React from "react";
import { useRouter } from "next/router";
import Dashboard from "../../components/Dashboard";
import { useForm, Controller } from "react-hook-form";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import MenuItem from "@material-ui/core/MenuItem";

const Profile = (props) => {
  const router = useRouter();
  const { control, handleSubmit, reset } = useForm(props.userLogin);
  const [signature, setSignature] = React.useState(props.userLogin.signature);
  const [prefix, setPrefix] = React.useState([]);

  const getPrefixname = () => {
    axios
      .get(`${props.env.api_url}getPrefixname`)
      .then((value) => {
        console.log(value.data);
        if (value.data.rowCount > 0) {
          setPrefix(value.data.result);
        } else {
          result([]);
        }
      })
      .catch((reason) => {
        console.log(reason);
      });
  };

  const onSubmit = (data) => {
    let tmp = {
      ...props.userLogin,
      ...data,
      insertStatus: false,
      myrole: props.userLogin.myrole,
      signature: signature,
    };
    console.log(tmp);

    axios
      .post(`${props.env.api_url}user/registermanual`, JSON.stringify(tmp))
      .then((value) => {
        console.log(value.data);
        if (value.data.success) {
          props.patchUserLogin(tmp);
          alert("บันทึกข้อมูลสำเร็จ");
        } else {
          alert("หมายเลขประจำตัวประชาชนหรืออีเมล์ถูกใช้งานแล้ว");
        }
      })
      .catch((reason) => {
        console.log(reason);
      });
  };

  React.useEffect(() => {
    getPrefixname();
    reset(props.userLogin);
    setSignature(props.userLogin.signature);
    // router.replace("/home");
  }, [props.userLogin]);

  return (
    <Dashboard {...props}>
      <div className="box-padding">
        <div className="row">
          <div className="col-9 mb-3">
            <h2>จัดการข้อมูลส่วนตัว</h2>
          </div>
          <div className="col-3 mb-3">
            <div className="text-right"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="row">
            <div className="col-lg-6">
              {/* {(() => {
              if (`${driverImg}`.length > 0) {
                return (
                  <div className="text-center" style={{ overflow: "auto" }}>
                    <img src={driverImg} width={"200px"} />
                  </div>
                );
              }
            })()}

            <div className="text-center mt-3 mb-2">
              <input
                type="file"
                id="carImgSelect"
                accept="image/*"
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

                  setDriverImage(img);
                }}
                style={{ display: "none" }}
              />

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  document.getElementById("carImgSelect").click();
                }}
              >
                เลือกรูปภาพ
              </button>
            </div> */}

              <Controller
                control={control}
                name="username"
                defaultValue={props.userLogin.username}
                render={({ field, value, onChange }) => (
                  <TextField
                    {...field}
                    label="ชื่อผู้ใช้งาน"
                    onChange={onChange}
                    value={value}
                    margin="normal"
                    required
                    fullWidth
                    disabled={true}
                  />
                )}
              />

              <Controller
                control={control}
                name="prename"
                defaultValue={""}
                render={({ field, value, onChange }) => (
                  <TextField
                    {...field}
                    label="คำนำหน้า"
                    value={value}
                    select
                    onChange={onChange}
                    margin="normal"
                    required
                    fullWidth
                  >
                    <MenuItem value={""}>--- โปรดเลือก ---</MenuItem>
                    {prefix.map((e, i) => {
                      return (
                        <MenuItem value={e.prefix} key={i}>
                          {e.prefix}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="firstname"
                defaultValue={props.userLogin.firstname}
                render={({ field, value, onChange }) => (
                  <TextField
                    {...field}
                    label="ชื่อจริง"
                    onChange={onChange}
                    value={value}
                    margin="normal"
                    required
                    fullWidth
                  />
                )}
              />

              <Controller
                control={control}
                name="lastname"
                defaultValue={props.userLogin.lastname}
                render={({ field, value, onChange }) => (
                  <TextField
                    {...field}
                    label="นามสกุล"
                    onChange={onChange}
                    value={value}
                    margin="normal"
                    required
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="col-lg-6">
              <Controller
                control={control}
                name="email"
                defaultValue={props.userLogin.email}
                render={({ field, value, onChange }) => (
                  <TextField
                    {...field}
                    label="อีเมล์"
                    onChange={onChange}
                    value={value}
                    margin="normal"
                    required
                    fullWidth
                  />
                )}
              />

              <Controller
                control={control}
                name="personal_id"
                defaultValue={props.userLogin.personal_id}
                render={({ field, value, onChange }) => (
                  <TextField
                    {...field}
                    label="หมายเลขประจำตัวประชาชน"
                    onChange={onChange}
                    value={value}
                    margin="normal"
                    required
                    fullWidth
                  />
                )}
              />

              <Controller
                control={control}
                name="phone_number"
                defaultValue={props.userLogin.phone_number}
                render={({ field, value, onChange }) => (
                  <TextField
                    {...field}
                    label="หมายเลขโทรศัพท์"
                    onChange={onChange}
                    value={value}
                    margin="normal"
                    required
                    fullWidth
                  />
                )}
              />

              <Controller
                control={control}
                name="position"
                defaultValue={props.userLogin.position}
                render={({ field, value, onChange }) => (
                  <TextField
                    {...field}
                    label="ตำแหน่ง"
                    onChange={onChange}
                    value={value}
                    margin="normal"
                    required
                    fullWidth
                  />
                )}
              />
            </div>
          </div>

          <input
            type="file"
            id="signatureInput"
            accept="image/*"
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

              setSignature(img);
            }}
            style={{ display: "none" }}
          />

          {(() => {
            if (`${signature}`.length > 0) {
              return (
                <div className="mt-3">
                  <h5 className="mb-2">
                    <b>รูปลายเซ็น</b>
                  </h5>
                  <img src={signature} width={"200px"} />
                </div>
              );
            }
          })()}

          <button
            type="button"
            className="btn btn-primary btn-sm mt-3"
            onClick={() => {
              document.getElementById("signatureInput").click();
            }}
          >
            เลือกลายเซ็น
          </button>

          <div className="mt-3 text-center">
            <button type="submit" className="btn btn-primary ">
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </Dashboard>
  );
};

export default Profile;

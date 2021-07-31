import React from "react";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import Link from "next/link";
import MenuItem from "@material-ui/core/MenuItem";

const Register = (props) => {
  const router = useRouter();
  const { control, handleSubmit, reset } = useForm();
  const [prefix, setPrefix] = React.useState([]);

  const onSubmit = (data) => {
    if (data.password !== data.c_password) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }

    let tmp = {
      ...data,
      insertStatus: true,
      myrole: "4",
    };
    console.log(tmp);

    axios
      .post(`${props.env.api_url}user/registermanual`, JSON.stringify(tmp))
      .then((value) => {
        console.log(value.data);
        if (value.data.success) {
          router.replace("/signin");
          alert("บันทึกข้อมูลสำเร็จ");
        } else {
          alert("หมายเลขประจำตัวประชาชนหรืออีเมล์ถูกใช้งานแล้ว");
        }
      })
      .catch((reason) => {
        console.log(reason);
      });
  };

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

  React.useEffect(() => {
    getPrefixname();
  }, []);

  return (
    <div className="container">
      <div className="box-padding">
        <div className="row">
          <div className="col-9 mb-3">
            <h2>สมัครสมาชิก</h2>
          </div>
          <div className="col-3 mb-3">
            <div className="text-right"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="row">
            <div className="col-lg-6">
              <Controller
                control={control}
                name="username"
                defaultValue={""}
                render={({ field, value, onChange }) => (
                  <TextField
                    {...field}
                    label="ชื่อผู้ใช้งาน"
                    onChange={onChange}
                    value={value}
                    margin="normal"
                    required
                    fullWidth
                  />
                )}
              />
              {/* 
              <Controller
                control={control}
                name="prename"
                defaultValue={""}
                render={({ field, value, onChange }) => (
                  <TextField
                    {...field}
                    label="คำนำหน้า"
                    onChange={onChange}
                    value={value}
                    margin="normal"
                    required
                    fullWidth
                  />
                )}
              /> */}

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
                defaultValue={""}
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
                defaultValue={""}
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

              <Controller
                control={control}
                name="password"
                defaultValue={""}
                render={({ field, value, onChange }) => (
                  <TextField
                    {...field}
                    label="รหัสผ่าน"
                    onChange={onChange}
                    value={value}
                    margin="normal"
                    type={"password"}
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
                defaultValue={""}
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
                defaultValue={""}
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
                defaultValue={""}
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
                defaultValue={""}
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

              <Controller
                control={control}
                name="c_password"
                defaultValue={""}
                render={({ field, value, onChange }) => (
                  <TextField
                    {...field}
                    label="ยืนยันรหัสผ่าน"
                    onChange={onChange}
                    value={value}
                    margin="normal"
                    type={"password"}
                    required
                    fullWidth
                  />
                )}
              />
            </div>
          </div>

          <div className="mt-3 text-center">
            <button type="submit" className="btn btn-primary mr-2">
              สมัครสมาชิก
            </button>

            <Link href={"/signin"}>
              <button type="button" className="btn btn-link ml-2">
                เข้าสู่ระบบ
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

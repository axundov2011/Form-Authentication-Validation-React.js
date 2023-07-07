import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import styles from "./Login.module.scss";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAuth,
  fetchRegister,
  selectIsAuth,
} from "../../redux/slices/auth";
import { useForm } from "react-hook-form";
export const Registration = () => {
  const isAuth = useSelector(selectIsAuth); // Burada bize deyir ki avtorizasiya olub ya olmayib
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  console.log(errors, isValid);
  const onSubmit = async (values) => {
    //Bu funksiya o zaman isleyecek ki  eger react hook form anlayacaq ki doğrulama yaxşı keçdi
    const data = await dispatch(fetchRegister(values));

    if (!data.payload) {
      return alert("Qeydiyyat uğursuz oldu!");
    }
    if ("token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {" "}
        {/* handleSubmit => bu funksiyanı yerinə yetirdiyinizi təqdim edin və bu iki sahə düzgün idisə, onu yalnız bu mübahisədə yerinə yetirin* */}
        <TextField
          className={styles.field}
          error={Boolean(errors.fullName?.message)}
          label="full Name"
          type="fullName"
          helperText={errors.fullName?.message}
          {...register("fullName", { required: "Adı daxil edin!" })}
          fullWidth
        />
        <TextField
          className={styles.field}
          error={Boolean(errors.email?.message)}
          label="E-Mail"
          type="email"
          helperText={errors.email?.message}
          {...register("email", { required: "Emaili  daxil edin!" })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Password"
          type="password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register("password", { required: "Şifrəni  daxil edin!" })}
          fullWidth
        />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};

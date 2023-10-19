import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { request, gql } from "graphql-request";
import { useHistory } from "react-router-dom";
import { alertEmitter } from "../../components/alert";
import Button from "../../components/button";
import InputBox from "../../components/input-box";
import Loader from "../../components/loader";
import "./index.css";

const AdminLogin = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const history = useHistory();

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (data) => {
    const query = gql`
      query ($data: LoginInput!) {
        loginAdmin(input: $data)
      }
    `;
    const variables = {
      data: data,
    };
    setSubmitting(true);
    request({
      url: process.env.REACT_APP_BACKEND_URL,
      variables,
      document: query,
      requestHeaders: {},
      // query
    })
      .then((res) => {
        setSubmitting(false);
        localStorage.setItem("jwt", res.loginAdmin);
        history.push("/admin");
      })
      .catch((error) => {
        alertEmitter.showAlert("Incorrect Name or Password!")
        setSubmitting(false);
      });
  };

  return (
    <div className="center-widescreen-width login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          rules={{
            required: "Name is required",
          }}
          render={({ field: { name, onChange, onBlur } }) => (
            <InputBox
              name={name}
              label="Name *"
              inputType="text"
              errorText={errors.name && errors.name.message}
              onBlur={onBlur}
              onChange={onChange}
            />
          )}
        />
        <Controller
          name="code"
          control={control}
          rules={{
            required: "Password is required",
          }}
          render={({ field: { name, onChange, onBlur } }) => (
            <InputBox
              name={name}
              label="Password *"
              inputType="password"
              errorText={errors.code && errors.code.message}
              onBlur={onBlur}
              onChange={onChange}
            />
          )}
        />
        <Button type="submit" disabled={submitting} id="submit-button">
          {submitting ? <Loader /> : <span>Submit</span>}
        </Button>
      </form>
    </div>
  );
};

export default AdminLogin;

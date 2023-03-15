import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { request, gql } from "graphql-request";
import { useHistory } from "react-router-dom";
import Alert from "../../components/alert";
import InputBox from "../../components/input-box";
import Loader from "../../components/loader";
import "./index.css";

const Login = () => {
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const history = useHistory();

  const [submitting, setSubmitting] = useState(false);
  const [isShow, setIsShow] = useState(false);

  const onSubmit = (data) => {
    delete data["confirmPassword"];
    const mutation = gql`
      mutation ($data: User!) {
        login(input: $data)
      }
    `;
    const variables = {
      data: data,
    };
    setSubmitting(true);
    console.log();
    request({
      url: process.env.REACT_APP_BACKEND_URL,
      variables,
      document: mutation,
      requestHeaders: {},
      // query
    })
      .then((res) => {
        setSubmitting(false);
        localStorage.setItem("jwt", res.login);
        history.push("/bingo");
      })
      .catch((error) => {
        setIsShow(true);
        setSubmitting(false);
      });
  };

  return (
    <div className="center-widescreen-width login-container">
      {/* <Alert type="error" message="Error" /> */}
      <h2>Get Your Card</h2>
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
          name="password"
          control={control}
          rules={{
            required: "Password is required",
          }}
          render={({ field: { name, onChange, onBlur } }) => (
            <InputBox
              name={name}
              label="Password *"
              inputType="password"
              errorText={errors.password && errors.password.message}
              helperText="Please create one at the first time!"
              onBlur={onBlur}
              onChange={onChange}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: "Confirm Password is required",
            validate: (value) =>
              value === watch("password") || "The passwords do not match",
          }}
          render={({ field: { name, onChange, onBlur } }) => (
            <InputBox
              name={name}
              label="Confirm Password *"
              inputType="password"
              errorText={
                errors.confirmPassword && errors.confirmPassword.message
              }
              onBlur={onBlur}
              onChange={onChange}
            />
          )}
        />
        <Controller
          name="code"
          control={control}
          rules={{
            required: "Code is required",
          }}
          render={({ field: { name, onChange, onBlur } }) => (
            <InputBox
              name={name}
              label="Code *"
              inputType="text"
              inputMode="numeric"
              errorText={errors.code && errors.code.message}
              onBlur={onBlur}
              onChange={onChange}
            />
          )}
        />
        <button id="submit-btn" type="submit" disabled={submitting}>
          {submitting ? <Loader /> : <span>Submit</span>}
        </button>
        <Alert
          message="Incorrect Code, Name or Password!"
          isShow={isShow}
          setIsShow={setIsShow}
        />
      </form>
    </div>
  );
};

export default Login;

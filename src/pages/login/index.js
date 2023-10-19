import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { request, gql } from "graphql-request";
import { useHistory } from "react-router-dom";
import { alertEmitter } from "../../components/alert";
import Button from "../../components/button";
import InputBox from "../../components/input-box";
import Loader from "../../components/loader";
import "./index.css";

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const history = useHistory();

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (data) => {
    const mutation = gql`
      mutation ($data: LoginInput!) {
        login(input: $data)
      }
    `;
    const variables = {
      data: data,
    };
    setSubmitting(true);
    request({
      url: process.env.REACT_APP_BACKEND_URL,
      variables,
      document: mutation,
      requestHeaders: {},
    })
      .then((res) => {
        setSubmitting(false);
        localStorage.setItem("jwt", res.login);
        history.push("/bingo");
      })
      .catch((error) => {
        alertEmitter.showAlert("Incorrect Code or Name!");
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

export default Login;

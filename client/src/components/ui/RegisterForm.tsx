import React, { FC, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import authService from "../../services/auth.service";
import userState from "../../store/userState";
import { IFormErrors, ILoginData } from "../../utils/formInterfaces";
import { validator } from "../../utils/validator";
import TextField from "../common/form/TextField";

interface ILoginProps {
  changeForm: () => void;
}

const RegisterForm: FC<ILoginProps> = ({ changeForm }) => {
  const [data, setData] = useState<ILoginData>({
    login: "",
    password: "",
    repeatedPassword: "",
  });
  const [errors, setErrors] = useState<IFormErrors>({});
  const [firstSub, setFirstSub] = useState<boolean>(false);

  useEffect(() => {
    if (firstSub) validate();
  }, [data]);

  const validate = () => {
    const validatorConfig = {
      login: {
        isRequired: {
          message: "Can't be empty",
        },
        min: {
          message: "Login can't contain less than 5 symbols",
          value: 5,
        },
      },
      password: {
        isRequired: {
          message: "Can't be empty",
        },
        min: {
          message: "Password can't contain less than 8 symbols",
          value: 8,
        },
        isContainDigit: {
          message: "Password must contain numbers",
        },
        sameWith: {
          value: data.repeatedPassword,
          message: "Passwords is not the same",
        },
      },
      repeatedPassword: {
        isRequired: {
          message: "Can't be empty",
        },
        min: {
          message: "Password can't contain less than 8 symbols",
          value: 8,
        },
        isContainDigit: {
          message: "Password must contain numbers",
        },
        sameWith: {
          value: data.password,
          message: "Passwords is not the same",
        },
      },
    };

    const errors = validator(data, validatorConfig);
    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!firstSub) setFirstSub(true);

    const isValid = validate();
    if (!isValid) return;
    const { login, password } = data;
    userState.signUp({ login, password });
  };

  return (
    <>
      <Card.Title className="text-center display-4 mb-4">Sign Up</Card.Title>
      <Form onSubmit={handleSubmit}>
        <TextField
          name="login"
          value={data.login}
          handleChange={handleChange}
          type="text"
          label="Login"
          error={errors["login"]}
        />

        <TextField
          name="password"
          value={data.password}
          handleChange={handleChange}
          type="password"
          label="Password"
          error={errors["password"]}
        />

        <TextField
          name="repeatedPassword"
          value={data.repeatedPassword}
          handleChange={handleChange}
          type="password"
          label="Repeate your password"
          error={errors["repeatedPassword"]}
        />

        <div className="d-grid gap-2 mt-4">
          <Button variant="primary" size="lg" type="submit">
            Sign Up
          </Button>

          <Button variant="link" onClick={changeForm}>
            Already have an account?
          </Button>
        </div>
      </Form>
    </>
  );
};

export default RegisterForm;

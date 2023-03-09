import React, { FC, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import userState from "../../store/userState";
import { IFormErrors, ILoginData } from "../../utils/formInterfaces";
import { validator } from "../../utils/validator";
import TextField from "../common/form/TextField";

const validatorConfig = {
  login: {
    isRequired: {
      message: "Enter your login, please",
    },
  },
  password: {
    isRequired: {
      message: "Can't be empty",
    },
  },
};

interface ILoginProps {
  changeForm: () => void;
}

const LoginForm: FC<ILoginProps> = ({ changeForm }) => {
  const [data, setData] = useState<ILoginData>({ login: "", password: "" });
  const [errors, setErrors] = useState<IFormErrors>({});
  const [firstSub, setFirstSub] = useState<boolean>(false);

  useEffect(() => {
    if (firstSub) validate();
  }, [data]);

  const validate = () => {
    const errors = validator(data, validatorConfig);
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!firstSub) setFirstSub(true);

    const isValid = validate();
    if (!isValid) return;

    const { login, password } = data;
    userState.login({ login, password });
  };

  return (
    <>
      <Card.Title className="text-center display-4 mb-4">Welcome</Card.Title>
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

        <div className="d-grid gap-2 mt-4">
          <Button variant="primary" size="lg" type="submit">
            Sign In
          </Button>

          <Button variant="link" onClick={changeForm}>
            Don't have an account?
          </Button>
        </div>
      </Form>
    </>
  );
};

export default LoginForm;

import React, { FC, useState } from "react";
import { Button, InputGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";

interface iForm {
  type: string;
  placeholder?: string;
  label: string;
  name: string;
  value: string;
  error: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextField: FC<iForm> = ({
  type,
  placeholder,
  label,
  name,
  handleChange,
  value,
  error,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <InputGroup className="has-validation">
        <Form.Control
          placeholder={placeholder}
          type={showPassword ? "text" : type}
          onChange={handleChange}
          value={value}
          name={name}
          className={error ? " is-invalid" : ""}
        />
        {type === "password" && (
          <Button
            variant="outline-secondary"
            onClick={() => setShowPassword((p) => !p)}
          >
            <i className={"bi bi-eye" + (showPassword ? "-slash" : "")}></i>
          </Button>
        )}
        {error && <div className="invalid-feedback ">{error}</div>}
      </InputGroup>
    </Form.Group>
  );
};

export default TextField;

/* <Form.Text className="text-muted">
        We'll never share your email with anyone else.
      </Form.Text> */

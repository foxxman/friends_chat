import React, { FC, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import chatsState from "../../store/chatsState";
import { IFormErrors, ILoginData } from "../../utils/formInterfaces";
import { validator } from "../../utils/validator";
import TextField from "../common/form/TextField";

const validatorConfig = {
  deskname: {
    isRequired: {
      message: "Can't be empty",
    },
  },
};

interface AddRoomProps {
  onSubmit: () => void;
}

const AddRoomForm: FC<AddRoomProps> = ({ onSubmit }) => {
  const [data, setData] = useState<ILoginData>({ roomname: "" });
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

    chatsState.createRoom(data["roomname"]);
    onSubmit();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <TextField
        name="roomname"
        value={data.roomname}
        handleChange={handleChange}
        type="text"
        label="Enter your new room name: "
        error={errors["roomname"]}
      />
      <Button type="submit" variant="outline-success">
        <span>Create Room</span>
      </Button>
    </Form>
  );
};

export default AddRoomForm;

import React, { FC, useState } from "react";
import { Card, Container, Row } from "react-bootstrap";
import LoginForm from "../components/ui/LoginForm";
import RegisterForm from "../components/ui/RegisterForm";
// import styles from "../scss/Form.module.scss";

const Login: FC = () => {
  const [signUp, setSignUp] = useState<boolean>(false);

  const changeForm = () => setSignUp((p) => !p);

  return (
    <Container className="h-100">
      <Row
        className="justify-content-md-center h-100 d-flex align-items-center"
        lg={3}
        md={2}
        xs={1}
      >
        <Card className="p-3 animate__animated animate__fadeInDown">
          <Card.Body>
            {signUp ? (
              <RegisterForm {...{ changeForm }} />
            ) : (
              <LoginForm {...{ changeForm }} />
            )}
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
};

export default Login;

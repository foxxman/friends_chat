import React from "react";
import { Oval } from "react-loader-spinner";
import styles from "../scss/App.module.scss";

const Loader = () => {
  return (
    <div className={styles.Loader}>
      <Oval
        height={80}
        width={80}
        color="#0d6efd"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#0d6efd"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
};

export default Loader;

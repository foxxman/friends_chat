import {
  IFormErrors,
  IValidConfig,
  ILoginData,
  IValidMethod,
} from "./formInterfaces";

interface validateFunction {
  validateMethod: string;
  data: string;
  config: IValidMethod;
}

function validate({ validateMethod, data, config }: validateFunction) {
  let statusValidate = false;

  switch (validateMethod) {
    case "isRequired": {
      if (typeof data === "boolean") {
        statusValidate = !data;
      } else {
        statusValidate = data.trim() === "";
      }
      break;
    }
    case "isEmail": {
      const emailRegExp = /^\S+@\S+\.\S+$/g;
      statusValidate = !emailRegExp.test(data);
      break;
    }
    case "isCapitalSymbol": {
      const capitalRegExp = /[A-Z]+/g;
      statusValidate = !capitalRegExp.test(data);
      break;
    }
    case "isContainDigit": {
      const digitRegExp = /\d+/g;
      statusValidate = !digitRegExp.test(data);
      break;
    }
    case "min": {
      statusValidate = config.value ? data.length < config.value : false;
      break;
    }
    case "sameWith": {
      statusValidate = config.value ? data !== config.value : false;
      break;
    }
    default:
      break;
  }

  if (statusValidate) return config.message;
}

export function validator(data: ILoginData, config: IValidConfig) {
  const errors: IFormErrors = {};

  for (const fieldName in data) {
    for (const validateMethod in config[fieldName]) {
      const error = validate({
        validateMethod,
        data: data[fieldName],
        config: config[fieldName][validateMethod],
      });

      if (error && !errors[fieldName]) {
        errors[fieldName] = error;
      }
    }
  }
  return errors;
}

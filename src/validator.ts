import Joi from "joi";

interface Body {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  username: string;
  dob: Date;
}


/**
 *
 *
 *
 *
 ** SIGN UP VALIDATOR
 *
 *
 *
 *
 *  */
export const signUpValidator = (body: Body) => {
  const validator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string(),
    username: Joi.string().required().max(60),
    dob: Joi.date(),
  });

  return validator.validate(body);
};

/**
 *
 *
 *
 *
 ** LOGIN VALIDATOR
 *
 *
 *
 *
 *  */

// TODO: Add functionality to let user login with username or email
export const loginValidator = (body: Body) => {
  const validator = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  return validator.validate(body);
};

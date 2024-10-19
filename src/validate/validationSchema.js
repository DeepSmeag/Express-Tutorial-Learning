export const createUserValidationSchema = {
  name: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage: "Name must be between 5 and 32 characters",
    },
    notEmpty: {
      errorMessage: "Name is required",
    },
    isString: {
      errorMessage: "Name must be a string",
    },
  },
};
export const createProductValidationSchema = {
  name: {
    isLength: {
      options: {
        min: 2,
        max: 32,
      },
      errorMessage: "Name must be between 2 and 32 characters",
    },
    notEmpty: {
      errorMessage: "Name is required",
    },
    isString: {
      errorMessage: "Name must be a string",
    },
  },
};

import joi from 'joi'
import pwdComplexity from 'joi-password-complexity'

const signUpSchema = joi.object({
    name: joi.string().min(3).max(25).required(),
    email: joi.string().pattern(new RegExp("^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$")).required(),
    password: joi.string().required(),
    confirmPassword: joi.any()
                        .equal(joi.ref('password'))
                        .required()
                        .label('confirmPassword')
                        .options({ messages: { 'any.only': '{{#label}} does not match'} })
})

const validatePassword = (password) => {

    const complexityOptions = {
        min: 8,
        max: 26,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        requirementCount: 3,
      };

    return pwdComplexity(complexityOptions, 'Password').validate(password).error
}

const signInSchema = joi.object({
    email: joi.string().required(),
    password: joi.string().required(),
})

export {
    signUpSchema,
    signInSchema,
    validatePassword
}

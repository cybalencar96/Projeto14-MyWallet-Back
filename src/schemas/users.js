import joi from 'joi'

const signUpSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().pattern(new RegExp("^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$")).required(),
    password: joi.string().required(),
    confirmPassword: joi.ref('password')
})

const signInSchema = joi.object({
    email: joi.string().required(),
    password: joi.string().required(),
})

export {
    signUpSchema,
    signInSchema
}

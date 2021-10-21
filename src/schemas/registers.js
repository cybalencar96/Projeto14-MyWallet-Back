import joi from 'joi'

const transactionSchema = joi.object({
    userId: joi.string().required(),
    value: joi.number().min(0.01).required(),
    description: joi.string().min(3).required(),
    entry: joi.boolean().required()
})

export {
    transactionSchema
}

import * as Yup from 'yup'

export const signInSchema = Yup.object().shape({
    email: Yup.string().required().email('wrong email'),
    password: Yup.string().required().min(6, 'min 6 chars').max(20, 'max 20 chars')
})

export type SignInFormData = Yup.InferType<typeof signInSchema>
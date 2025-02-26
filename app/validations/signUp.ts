import * as Yup from 'yup'

export const signUpSchema = Yup.object().shape({
    fullName: Yup.string().required('fullname is required'),
    email: Yup.string().required().email('wrong email'),
    password: Yup.string().required().min(6, 'min 6 chars').max(20, 'max 20 chars')
})

export type SignUpFormData = Yup.InferType<typeof signUpSchema>
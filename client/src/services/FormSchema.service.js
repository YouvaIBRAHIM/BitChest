import * as yup from 'yup';

export const signUpSchema = yup.object().shape({
    firstname: yup.string()
        .min(1, 'Trop court.')
        .max(50, 'Trop long.')
        .required('Champ obligatoire.'),
    lastname: yup.string()
        .min(1, 'Trop long.')
        .max(50, 'Trop long.')
        .required('Champ obligatoire.'),
    role: yup.string()
        .required('Champ obligatoire.'),
    email: yup.string()
        .email('Email invalide.')
        .required('Champ obligatoire.'),
    password: yup.string()
        .min(8, 'Trop court.')
        .max(50, 'Trop long.')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@,#\$%\^&\*])(?=.{8,})/, "Mot de passe invalide.")
        .required('Champ obligatoire.'),
    confirmationPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Les mots de passe doivent être similaires.')
        .required('Champ obligatoire.'),
});
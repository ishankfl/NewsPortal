import * as Yup from 'yup';
import { Role } from '../components/common/Role';

export const userValidationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  plainPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  role: Yup.number()
    .oneOf(Object.values(Role).filter(v => typeof v === 'number'), 'Invalid Role')
    .required('Role is required'),
});

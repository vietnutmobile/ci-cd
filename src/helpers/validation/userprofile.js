import * as Yup from 'yup';

export const createUserProfileSchema = () => {
  return Yup.object().shape({
    userId: Yup.string().required('User ID is required'),
    orgId: Yup.string().required('Org ID is required'),
    name: Yup.string().required('Name is required'),
    title: Yup.string().required('Title is required'),
    avatar: Yup.string(),
  });
};

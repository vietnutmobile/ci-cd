import * as Yup from 'yup';

export const createNutValidationSchema = ({ requireOneOf = [] } = {}) => {
  return Yup.object({
    name: Yup.string().required('Name is required'),
    stageId: Yup.string().required('Stage is required'),
    // leadSource: Yup.string().required('Lead Source is required'),
    assignedUserId: Yup.string().required('Assigned User is required'),
    // notes: Yup.string().nullable(),
    // contactId: Yup.string().nullable(),
  });
};

export const createNutFileValidation = () => {
  Yup.addMethod(Yup.mixed, 'maxFileSize', function (maxSize, errorMessage) {
    return this.test('maxFileSize', errorMessage, function (value) {
      if (!value) return true;
      return value && value.size <= maxSize;
    });
  });

  return Yup.object({
    nutId: Yup.string().required('Nut ID is required'),
    file: Yup.mixed()
      .required('A file is required')
      .maxFileSize(10 * 1024 * 1024, 'The file is too large (max 10MB)'),
  });
};

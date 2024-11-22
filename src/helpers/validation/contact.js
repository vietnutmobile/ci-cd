import { capitalizeWords } from '@/helpers';
import { operators } from '@/helpers/constants/nuts';
import { isPhoneNumber } from '@/helpers/validation/phone-number';
import { validateExpression } from '@/helpers/validation/rules';
import humps from 'humps';
import * as Yup from 'yup';

export const createCsvNutColumnMappingValidationSchema = (
  { nutMapOneOf, contactMapOneOf } = {
    nutMapOneOf: [],
    contactMapOneOf: [],
  },
) => {
  Yup.addMethod(Yup.object, 'nutMapOneOf', function (fields) {
    return this.test(
      'nutMapOneOf',
      `At least one of the following fields is mapped: ${fields.map((field) => capitalizeWords(field)).join(', ')}`,
      (value) => {
        return Object.values(value).some((field) => fields.includes(field));
      },
    );
  });

  Yup.addMethod(Yup.object, 'contactMapOneOf', function (fields) {
    return this.test(
      'contactMapOneOf',
      `At least one of the following fields is mapped: ${fields.map((field) => capitalizeWords(field)).join(', ')}`,
      (value) => {
        const values = Object.values(value);
        const hasAtLeastOneContactField = values.some((field) => field.includes('contact'));
        return !hasAtLeastOneContactField || values.some((field) => fields.includes(field));
      },
    );
  });

  return Yup.object().nutMapOneOf(nutMapOneOf).contactMapOneOf(contactMapOneOf);
};

export const createNutObjectSchema = ({
  shouldValidateContact,
  nutRequireOneOf,
  contactRequireOneOf,
}) => {
  Yup.addMethod(Yup.object, 'requireOneOf', function (fields) {
    return this.test(
      'requireOneOf',
      `At least one of the following fields is required: ${capitalizeWords(fields.join(', '))}`,
      (value) => {
        return fields?.length <= 0 || fields.some((field) => value?.[field]?.length > 0);
      },
    );
  });

  const nutObjectSchema = Yup.object({
    'contact - avatar': Yup.mixed().nullable(),
    'contact - firstName': Yup.string().nullable(),
    'contact - lastName': Yup.string().nullable(),
    'contact - fullName': Yup.string().nullable(),
    'contact - email': Yup.string().nullable(),
    'contact - phone': Yup.string().nullable(),
    'contact - address': Yup.string().nullable(),
    'contact - companyName': Yup.string().nullable(),
    'contact - companyId': Yup.string().nullable(),
    'contact - position': Yup.string().nullable(),
    'contact - title': Yup.string().nullable(),
    'contact - role': Yup.string().nullable(),
    'contact - linkedin': Yup.string().nullable(),
    'contact - facebook': Yup.string().nullable(),
    'contact - tiktok': Yup.string().nullable(),
    'nut - name': Yup.string().nullable(),
    'nut - notes': Yup.string().nullable(),
    'nut - comments': Yup.string().nullable(),
  });

  return shouldValidateContact
    ? nutObjectSchema.requireOneOf(nutRequireOneOf).requireOneOf(contactRequireOneOf)
    : nutObjectSchema.requireOneOf(nutRequireOneOf);
};

export const createNutsImportQueryValidationSchema = (
  { nutRequireOneOf, contactRequireOneOf, shouldValidateContact } = {
    nutRequireOneOf: [],
    contactRequireOneOf: [],
    shouldValidateContact: false,
  },
) => {
  Yup.addMethod(Yup.string, 'isValidExpression', function () {
    return this.test('isValidExpression', `Please provide a valid boolean expression`, (value) => {
      const expression = value ?? '';
      return !expression || validateExpression(expression);
    });
  });

  const nutObjectSchema = createNutObjectSchema({
    shouldValidateContact,
    nutRequireOneOf,
    contactRequireOneOf,
  });

  return Yup.object({
    stageId: Yup.string().required('Stage is required'),
    rules: Yup.array().of(
      Yup.object({
        name: Yup.string().required('Rule name is required'),
        isActive: Yup.boolean(),
        isEditing: Yup.boolean(),
        conditions: Yup.array().of(
          Yup.object({
            field: Yup.string().required('Field is required'),
            operator: Yup.string().oneOf(operators),
            value: Yup.string().required('Value is required'),
          }),
        ),
        expression: Yup.string().when(['conditions'], ([conditionsValue], schema) => {
          const conditions = conditionsValue ?? [];

          if (conditions?.length <= 0) {
            return schema.nullable();
          }

          const allowedSymbols = Array.from(
            { length: conditions?.length },
            (_, index) => index + 1,
          );

          return schema
            .isValidExpression()
            .matches(
              RegExp(`^(${allowedSymbols.join('|')}|[&|ANDOR()\\s])+$`),
              `Expression should only contain these symbols: ${allowedSymbols.join(',')}.`,
            );
        }),
        assignees: Yup.array()
          .of(Yup.string())
          .min(1, 'At least one assignee is required')
          .required('Rule must have assignees'),
      }),
    ),
    nuts: Yup.array().of(nutObjectSchema),
  });
};

export const createNutListValidationSchema = (
  { nutRequireOneOf, contactRequireOneOf, shouldValidateContact } = {
    nutRequireOneOf: [],
    contactRequireOneOf: [],
    shouldValidateContact: false,
  },
) => {
  const nutObjectSchema = createNutObjectSchema({
    shouldValidateContact,
    nutRequireOneOf,
    contactRequireOneOf,
  });

  return Yup.object({
    nuts: Yup.array().of(nutObjectSchema),
  });
};

export const createCsvContactColumnMappingValidationSchema = ({ mapOneOf } = { mapOneOf: [] }) => {
  Yup.addMethod(Yup.object, 'mapOneOf', function (fields) {
    return this.test(
      'mapOneOf',
      `At least one of the following fields is mapped: ${fields.map((field) => humps.pascalize(field)).join(', ')}`,
      (value) => {
        return Object.values(value).some((field) => fields.includes(field));
      },
    );
  });

  return Yup.object().mapOneOf(mapOneOf);
};

export const createContactListValidationSchema = ({ requireOneOf } = { requireOneOf: [] }) => {
  Yup.addMethod(Yup.string, 'isPhoneNumber', isPhoneNumber);

  Yup.addMethod(Yup.object, 'requireOneOf', function (fields) {
    return this.test(
      'requireOneOf',
      `At least one of the following fields is required: ${fields.toString()}`,
      (value) => {
        return fields?.length <= 0 || fields.some((field) => value?.[field]?.length > 0);
      },
    );
  });

  return Yup.object({
    contacts: Yup.array().of(
      Yup.object({
        avatar: Yup.mixed().nullable(),
        firstName: Yup.string().nullable(),
        lastName: Yup.string().nullable(),
        fullName: Yup.string().nullable(),
        email: Yup.string().email('Email is invalid').nullable(),
        phone: Yup.string().isPhoneNumber('Phone number is invalid').nullable(),
        address: Yup.string().nullable(),
        companyName: Yup.string().nullable(),
        companyId: Yup.string().nullable(),
        position: Yup.string().nullable(),
        title: Yup.string().nullable(),
        role: Yup.string().nullable(),
        linkedin: Yup.string().nullable(),
        facebook: Yup.string().nullable(),
        tiktok: Yup.string().nullable(),
        tags: Yup.string().nullable(),
      }).requireOneOf(requireOneOf),
    ),
  });
};

export const createContactValidationSchema = ({ requireOneOf } = { requireOneOf: [] }) => {
  Yup.addMethod(Yup.string, 'isPhoneNumber', isPhoneNumber);

  Yup.addMethod(Yup.object, 'requireOneOf', function (fields) {
    return this.test(
      'requireOneOf',
      `At least one of the following fields is required: ${fields.toString()}`,
      (value) => {
        return fields?.length <= 0 || fields.some((field) => value?.[field]?.length > 0);
      },
    );
  });

  return Yup.object({
    avatar: Yup.mixed().nullable(),
    firstName: Yup.string().nullable(),
    lastName: Yup.string().nullable(),
    fullName: Yup.string().nullable(),
    email: Yup.string().email('Email is invalid').nullable(),
    phone: Yup.string().isPhoneNumber('Phone number is invalid').nullable(),
    address: Yup.string().nullable(),
    companyName: Yup.string().nullable(),
    companyId: Yup.string().nullable(),
    position: Yup.string().nullable(),
    title: Yup.string().nullable(),
    role: Yup.string().nullable(),
    linkedin: Yup.string().nullable(),
    facebook: Yup.string().nullable(),
    tiktok: Yup.string().nullable(),
    tags: Yup.string().nullable(),
  }).requireOneOf(requireOneOf);
};

export const createAssigningRulesValidationSchema = (
  { conditions, expression } = { conditions: [], expression: '' },
) => {
  return Yup.object({
    conditions: Yup.array().of(
      Yup.object({
        field: Yup.string().required(),
        operator: Yup.string().required(),
        value: Yup.string().required(),
      }),
    ),
  }).requireOneOf(requireOneOf);
};

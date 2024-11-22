import * as Yup from 'yup';

export const isPhoneNumber = (message) =>
  Yup.string().test('isPhoneNumber', message, async (value) => {
    if (!value || value?.length <= 0) return true;
    const { parsePhoneNumber } = await import('awesome-phonenumber');
    let phoneNumber = value;
    if (phoneNumber?.startsWith('0')) phoneNumber = value.replace(/^0+/, '+84');
    return phoneNumber ? parsePhoneNumber(phoneNumber).valid : false;
  });

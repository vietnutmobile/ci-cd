import * as Yup from "yup";

export const createContactTagsSchema = () => Yup.object({
  name: Yup.string().required(),
  slug: Yup.string().nullable(),
  description: Yup.string().nullable(),
  contacts: Yup.array().of(Yup.string().nullable()).nullable(),
})

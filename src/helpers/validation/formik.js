export const FIELD_NAME_UNNAMED = 'unnamed'

export const toFormikErrors = (error) => {
  return (error?.inner ?? []).reduce((result, error) => {
    const field = error?.path || FIELD_NAME_UNNAMED
    result[field] = error.errors[0]
    return result
  }, {})
}


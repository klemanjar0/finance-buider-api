export interface CreateUserPayload {
  email: string;
  password: string;
}

export const isCreateUserPayload = (
  payload: any,
): payload is CreateUserPayload => {
  return (
    !!payload.email &&
    !!payload.password &&
    typeof payload.email == 'string' &&
    typeof payload.email == 'string'
  );
};

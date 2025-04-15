// Tipos para o Supabase
export type AuthChangeEvent =
  | "SIGNED_IN"
  | "SIGNED_OUT"
  | "USER_UPDATED"
  | "USER_DELETED"
  | "PASSWORD_RECOVERY"
  | "TOKEN_REFRESHED"
  | "MFA_CHALLENGE_VERIFIED"

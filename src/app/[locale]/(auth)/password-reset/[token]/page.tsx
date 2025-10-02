import ResetPasswordForm from "./ResetPasswordForm";

type PasswordResetPageProps = {
  params: Promise<{
    token: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const toStringParam = (value: string | string[] | undefined): string =>
  typeof value === "string" ? value : "";

const toOptionalString = (
  value: string | string[] | undefined,
): string | undefined => (typeof value === "string" ? value : undefined);

export default async function PasswordResetPage({
  params,
  searchParams,
}: PasswordResetPageProps) {
  const [{ token }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  return (
    <ResetPasswordForm
      token={token}
      email={toStringParam(resolvedSearchParams.email)}
      type={toOptionalString(resolvedSearchParams.type)}
    />
  );
}

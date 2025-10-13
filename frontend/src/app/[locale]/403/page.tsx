// app/[locale]/403/page.tsx
export default function ForbiddenPage() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold">403 - Forbidden</h1>
      <p className="text-muted-foreground">
        You do not have permission to access this page.
      </p>
    </div>
  );
}

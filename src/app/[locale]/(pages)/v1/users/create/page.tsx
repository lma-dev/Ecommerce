import BreadCrumb from "@/app/[locale]/_components/ui/bread-crumb";
import UserForm from "@/v1/users/_components/UserForm";

export default function CreateUserPage() {
  return (
    <div>
      <BreadCrumb title="Create User" />
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Create User</h1>
        <UserForm mode="create" />
      </div>
    </div>
  );
}

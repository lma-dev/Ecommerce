import { useDeleteUser, useExportUser, useUpdateUser } from "@/features/users/api";
import { useRouter } from "next/navigation";
import type { User } from "../types";
import { useLocale } from "next-intl";

export const useUserActionHandlers = (user: User) => {
    const deleteUser = useDeleteUser();
    const updateStatus = useUpdateUser();
    const exportUser = useExportUser();
    const router = useRouter();
    const locale = useLocale();

    return {
        onEdit: () => router.push(`/${locale}/v1/users/${user.id}/edit`),
        onDelete: () => deleteUser.mutate({ id: user.id }),
        onToggleStatus: () => updateStatus.mutate({ id: user.id }),
        onExport: () => exportUser.mutate({ id: user.id }),
        isSuspended: user.accountStatus === "SUSPENDED"
    };
};

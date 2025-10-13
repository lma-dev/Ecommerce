import { useDeleteUser, useExportUser, useUpdateUser } from "@/features/users/api";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import type { User } from "../types";
import { useLocale } from "next-intl";

export const useUserActionHandlers = (user: User) => {
    const deleteUser = useDeleteUser();
    const updateStatus = useUpdateUser();
    const exportUser = useExportUser();
    const router = useRouter();
    const locale = useLocale();
    const { data: session } = useSession();

    return {
        onEdit: () => router.push(`/${locale}/v1/users/${user.id}/edit`),
        onDelete: () => deleteUser.mutate(
            { id: user.id },
            {
                onSuccess: async (_data, variables) => {
                    try {
                        const deletedId = variables.id as any;
                        const currentId = (session?.user as any)?.id;
                        if (currentId && deletedId === currentId) {
                            await signOut({ callbackUrl: `/${locale}/login` });
                        }
                    } catch {}
                },
            }
        ),
        onToggleStatus: () => updateStatus.mutate({ id: user.id }),
        onExport: () => exportUser.mutate({ id: user.id }),
        isSuspended: user.accountStatus === "SUSPENDED"
    };
};

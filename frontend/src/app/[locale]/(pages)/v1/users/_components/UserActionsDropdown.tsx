'use client'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Download, Pencil, Trash2, MoreVertical } from 'lucide-react'
import { useUserActionHandlers } from '@/features/users/hooks/useUserActionHandlers'
import type { User } from '@/features/users/types'
import { useTranslations } from 'next-intl'

type DialogType = 'delete' | 'export' | null

interface UserActionDropdownProps {
  user: User
  showDialog: (type: DialogType, method: () => void) => void
}

export const UserActionDropdown: React.FC<UserActionDropdownProps> = ({ user, showDialog }) => {
  const { onEdit, onDelete, onExport } = useUserActionHandlers(user)
  const t = useTranslations('Translation')

  const handleDeleteClick = () => {
    showDialog('delete', onDelete)
  }

  const handleExportClick = () => {
    showDialog('export', onExport)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>{t('setting')}</DropdownMenuLabel>

        <DropdownMenuItem onSelect={handleExportClick}>
          <Download className="mr-2 h-4 w-4" />
          {t('export')}
        </DropdownMenuItem>

        {/* {(role === "ADMIN" || role === "SUPER_ADMIN") && ( */}
        <>
          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            {t('edit')}
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>{t('dangerZone')}</DropdownMenuLabel>

          <DropdownMenuItem
            onSelect={handleDeleteClick}
            className="text-red-500 focus:text-red-500"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t('delete')}
          </DropdownMenuItem>
        </>
        {/* )} */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

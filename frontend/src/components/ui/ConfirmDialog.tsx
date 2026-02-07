import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogAction,
	AlertDialogCancel,
} from '@/components/ui/alert-dialog'

interface ConfirmDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	title: string
	description?: string
	okText?: string
	cancelText?: string
	onOk: () => void
	onCancel?: () => void
}

export function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description = '',
	okText = 'Aceptar',
	cancelText,
	onOk,
	onCancel,
}: ConfirmDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					{description && (
						<AlertDialogDescription>{description}</AlertDialogDescription>
					)}
				</AlertDialogHeader>

				<AlertDialogFooter>
					{cancelText && (
						<AlertDialogCancel onClick={onCancel}>
							{cancelText}
						</AlertDialogCancel>
					)}
					<AlertDialogAction onClick={onOk}>{okText}</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
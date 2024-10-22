import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPortal,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Props {
  open: boolean
  onOpenChange?: (value: boolean) => void
  message: string
  title: string
  onConfirm: (value: boolean) => void
  onCancel: (value: boolean) => void
}

export default function ConfirmDialog({
  open, onOpenChange, title, message, onConfirm, onCancel,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogPortal>
        <AlertDialogContent className="max-w-md w-[calc(100%-2rem)]">
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
              {message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => onConfirm(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => onCancel(true)}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
}

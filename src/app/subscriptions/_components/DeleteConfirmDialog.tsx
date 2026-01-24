import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

/**
 * 一覧ページ：削除確認ダイアログ
 */

export const DeleteConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: DeleteConfirmDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full max-w-md sm:max-w-lg mx-auto">
        <AlertDialogHeader className="mb-4">
          <AlertDialogTitle className="sm:text-base text-sm font-bold text-gray-600 mb-4 text-center">
            削除確認
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center sm:text-base text-sm font-normal text-gray-600">
            登録内容を削除します
            <br />
            よろしいでしょうか
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center gap-3 sm:justify-center flex-row ">
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            はい
          </AlertDialogAction>
          <AlertDialogCancel>いいえ</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

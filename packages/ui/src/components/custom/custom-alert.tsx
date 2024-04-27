import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

type CustomAlertDialogProps = {
  open: boolean;
  setIsOpen: (val: boolean) => void;
  title?: string;
  description?: string;
  handleSubmit: () => void;
  isSubmitting?: boolean;
};

export function CustomAlert({
  open,
  setIsOpen,
  title,
  description,
  handleSubmit,
  isSubmitting,
}: CustomAlertDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title || "Are you absolutely sure?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description || "This action cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <AlertDialogAction
            disabled={isSubmitting}
            className="bg-red-400 text-white"
            onClick={handleSubmit}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

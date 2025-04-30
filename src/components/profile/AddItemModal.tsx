
import React, { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface AddItemModalProps {
  title: string;
  description: string;
  triggerText: string;
  children: ReactNode | ((props: { close: () => void }) => ReactNode);
  buttonVariant?: "default" | "outline" | "ghost";
  buttonSize?: "default" | "sm" | "lg";
  className?: string;
}

const AddItemModal = ({
  title,
  description,
  triggerText,
  children,
  buttonVariant = "outline",
  buttonSize = "sm",
  className = "",
}: AddItemModalProps) => {
  const [open, setOpen] = React.useState(false);
  
  const handleClose = () => {
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize} className={`gap-1 ${className}`}>
          <PlusCircle className="h-4 w-4" /> {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {typeof children === 'function' 
          ? children({ close: handleClose }) 
          : children
        }
      </DialogContent>
    </Dialog>
  );
};

export default AddItemModal;

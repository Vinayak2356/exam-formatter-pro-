import { useState } from "react";
import { CKEditor } from "ckeditor4-react";
import { Button } from "@/components/ui/button";
import { Maximize, Paintbrush } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function EditorModal({
  value,
  onChange,
  title = "Open Editor",
}: {
  value: string;
  onChange: (val: string) => void;
  title?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          type="button"
          className="w-full flex justify-between h-14 bg-white/50 hover:bg-white transition-colors"
        >
          <span className="flex items-center gap-2 font-medium">
            <Paintbrush className="w-4 h-4 text-primary" /> {title}
          </span>
          <Maximize className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent 
        onInteractOutside={(e) => e.preventDefault()} 
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="max-w-[95vw] w-[1400px] h-[95vh] flex flex-col p-4 sm:p-6 bg-slate-50 dark:bg-slate-900"
      >
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden border rounded-md shadow-sm bg-white">
          {open && (
            <CKEditor
              editorUrl="https://cdnjs.cloudflare.com/ajax/libs/ckeditor/4.22.1/ckeditor.js"
              initData={value}
              config={{
                versionCheck: false,
                height: "calc(95vh - 160px)",
                resize_enabled: false,
              }}
              onChange={(e: any) => onChange(e.editor.getData())}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

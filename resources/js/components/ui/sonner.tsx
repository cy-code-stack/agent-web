import { Toaster as Sonner, type ToasterProps } from 'sonner';

export function Toaster({ ...props }: ToasterProps) {
    return (
        <Sonner
            position="bottom-right"
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl',
                    description: 'group-[.toast]:text-muted-foreground text-xs',
                    actionButton:
                        'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
                    cancelButton:
                        'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
                    success:
                        'group-[.toaster]:border-emerald-500/30 group-[.toaster]:bg-emerald-50 group-[.toaster]:text-emerald-900 dark:group-[.toaster]:bg-emerald-950/50 dark:group-[.toaster]:text-emerald-100',
                    error:
                        'group-[.toaster]:border-red-500/30 group-[.toaster]:bg-red-50 group-[.toaster]:text-red-900 dark:group-[.toaster]:bg-red-950/50 dark:group-[.toaster]:text-red-100',
                    warning:
                        'group-[.toaster]:border-amber-500/30 group-[.toaster]:bg-amber-50 group-[.toaster]:text-amber-900 dark:group-[.toaster]:bg-amber-950/50 dark:group-[.toaster]:text-amber-100',
                    info:
                        'group-[.toaster]:border-blue-500/30 group-[.toaster]:bg-blue-50 group-[.toaster]:text-blue-900 dark:group-[.toaster]:bg-blue-950/50 dark:group-[.toaster]:text-blue-100',
                },
            }}
            {...props}
        />
    );
}

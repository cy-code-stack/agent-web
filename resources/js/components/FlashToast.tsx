import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import type { PageProps } from '@/types';

export function FlashToast() {
    const { flash } = usePage<PageProps>().props;

    const prevFlash = useRef<typeof flash>({});

    useEffect(() => {
        if (flash.success && flash.success !== prevFlash.current.success) {
            toast.success(flash.success, { duration: 4000 });
        }
        if (flash.error && flash.error !== prevFlash.current.error) {
            toast.error(flash.error, { duration: 5000 });
        }
        if (flash.info && flash.info !== prevFlash.current.info) {
            toast.info(flash.info, { duration: 4000 });
        }
        if (flash.warning && flash.warning !== prevFlash.current.warning) {
            toast.warning(flash.warning, { duration: 4000 });
        }
        prevFlash.current = flash;
    }, [flash.success, flash.error, flash.info, flash.warning]);

    return null;
}

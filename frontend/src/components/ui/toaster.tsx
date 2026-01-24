import React from 'react'
import { useToast } from '@/hooks'
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@/components/ui/toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map((t) => (
        <Toast
          key={t.id}
          open={Boolean(t.open)}
          onOpenChange={(open) => t.onOpenChange?.(open)}
        >
          <div className="flex flex-1 flex-col pr-4">
            {t.title ? <ToastTitle>{t.title}</ToastTitle> : null}
            {t.description ? <ToastDescription>{t.description}</ToastDescription> : null}
          </div>
          <ToastClose />
        </Toast>
      ))}

      <ToastViewport />
    </ToastProvider>
  )
}

export default Toaster

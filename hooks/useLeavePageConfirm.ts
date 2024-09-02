import { useEffect } from 'react'

export const useLeavePageConfirm = (hasChanges: boolean) => {
  useEffect(() => {
    if (!hasChanges) return

    function handleOnBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault()
      return (event.returnValue = '')
    }
    window.addEventListener('beforeunload', handleOnBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleOnBeforeUnload)
    }
  }, [hasChanges])
}

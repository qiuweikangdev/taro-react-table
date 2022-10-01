type UseRenderedCallback<T> = () => T

const useRendered = <T = any>(fn: UseRenderedCallback<T>): T => {
  return fn?.()
}
export default useRendered

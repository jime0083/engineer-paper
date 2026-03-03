import { useEffect } from 'react';
import { useFormContext } from '../context/FormContext';

/**
 * 入力データがある場合にページ離脱時にアラートを表示するフック
 */
function useBeforeUnload() {
  const { hasData } = useFormContext();

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasData()) {
        event.preventDefault();
        // Chrome対応
        event.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasData]);
}

export default useBeforeUnload;

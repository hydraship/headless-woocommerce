import { useEffect } from 'react';
import { LoadingModal } from '@src/components/common/loading-modal';
import { useUrlCartHandler } from '@src/lib/hooks/url-cart-handler';

/**
 * Component that handles URL parameters for cart actions
 */
export const UrlCartHandler = () => {
  const { processUrlParams, isLoading } = useUrlCartHandler();

  useEffect(() => {
    processUrlParams();
  }, [processUrlParams]);

  // Return the loading modal when loading, otherwise null
  return <LoadingModal isOpen={isLoading} />;
};

export default UrlCartHandler;

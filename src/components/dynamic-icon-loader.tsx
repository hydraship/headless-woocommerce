import { CiCircleInfo, CiDeliveryTruck, CiLock, CiViewList } from 'react-icons/ci';
import { FiLock } from 'react-icons/fi';
import { GoShieldCheck } from 'react-icons/go';
import { BsExclamationOctagon } from 'react-icons/bs';
import { TruckIcon } from './svg/truck-icon';
import { PackageIcon } from './svg/package-icon';

export interface DynamicIconLoaderProps {
  name:
    | 'CiDeliveryTruck'
    | 'CiLock'
    | 'CiViewList'
    | 'FiTruck'
    | 'FiLock'
    | 'FiPackage'
    | 'CiCircleInfo'
    | 'GoShieldCheck'
    | 'BsExclamationOctagon';
}

export const DynamicIconLoader = ({ name, ...rest }: DynamicIconLoaderProps) => {
  switch (name) {
    case 'CiDeliveryTruck':
      return <CiDeliveryTruck {...rest} />;
    case 'CiLock':
      return <CiLock {...rest} />;
    case 'CiViewList':
      return <CiViewList {...rest} />;
    case 'FiTruck':
      return <TruckIcon {...rest} />;
    case 'FiLock':
      return <FiLock {...rest} />;
    case 'FiPackage':
      return <PackageIcon {...rest} />;
    case 'GoShieldCheck':
      return <GoShieldCheck {...rest} />;
    case 'BsExclamationOctagon':
      return <BsExclamationOctagon {...rest} />;
    case 'CiCircleInfo':
    default:
      return <CiCircleInfo {...rest} />;
  }
};

import { FaExclamationCircle } from 'react-icons/fa';

const MessageDisplay = () => (
  <p className="text-muted-foreground text-sm mb-4 border border-primary p-2.5 flex flex-start items-center gap-2">
    <FaExclamationCircle className="text-primary" /> Please choose at least 1 item.
  </p>
);

export default MessageDisplay;

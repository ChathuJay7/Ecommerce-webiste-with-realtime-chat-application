import { useState } from "react";

const useNotification = () => {
  const [notification, setNotification] = useState<any[]>([]);
  return [notification, setNotification] as const;
};

export default useNotification;

import { useState } from 'react';

const useToggle = (initial = false): [boolean, () => void, (value: boolean) => void] => {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue(v => !v);
  return [value, toggle, setValue];
};

export default useToggle;

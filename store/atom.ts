import { atom } from 'recoil';
import { v1 } from 'uuid';

export const showUserOptionsAtom = atom({
  key: `showUserOptions${v1()}`,
  default: false,
});

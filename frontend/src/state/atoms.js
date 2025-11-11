import { atom } from 'jotai';

export const authAtom = atom({ role: null });

export const loginModalAtom = atom(false);
export const roleSelectionAtom = atom(false);

export const selectedTagAtom = atom(null);



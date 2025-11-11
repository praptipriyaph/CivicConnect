import { atom } from 'jotai';

// Auth snapshot used only for UI decisions; source of truth remains Clerk
export const authAtom = atom({ role: null });

// UI modals/toggles
export const loginModalAtom = atom(false);
export const roleSelectionAtom = atom(false);
export const notificationOpenAtom = atom(false);

// Simple cross-component filters
export const selectedTagAtom = atom(null);



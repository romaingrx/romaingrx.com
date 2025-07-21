import { persistentAtom } from '@nanostores/persistent';
import { emptyContactForm, type ContactFormData } from '../schemas/contact';

export const $contactForm = persistentAtom<ContactFormData>(
  'contactFormData:', // Key prefix for localStorage
  emptyContactForm,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

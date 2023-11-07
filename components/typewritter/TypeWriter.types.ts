import { CSS } from '@/design';
import { Options, TypewriterClass } from 'typewriter-effect';

export interface TypeWriterOptionsType extends Options {
  css?: CSS;
  onInit?: (typewriter: TypewriterClass) => void;
}

import { mergeExpects, Expect } from '@playwright/test';
import { expect as toHaveColorATS} from './toHaveColorATS';
import { expect as toHaveVisibleFocus } from './visibleFocus';

//This is how it looks in the official docs but VSCode? Typescript? is unhappy
//export const expect = mergeExpects(toHaveColorATS, toHaveVisibleFocus);

//Typescript happy here, but then won't recognize custom assertions in Actor
//export const expect = mergeExpects(toHaveColorATS, toHaveVisibleFocus) as Expect;
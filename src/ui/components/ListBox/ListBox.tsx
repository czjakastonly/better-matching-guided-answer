/**
 * ListBox is a list of elements of any type (div, span, img, etc)
 * that can be marked selected and/or highlighted  and/or can have some actions on click/enter-pressed/space-pressed.
 *
 * Component providing functionalities similar to "listbox" aria role + allows having non-selectable elements in between
 *
 * It's not managing aria attributes yet but it would be easy to add.
 *
 * Check stories for examples
 *
 * It doesn't have it's default visual representation.
 *
 * In order to create some, you can do it like this:
 *


  import { List } from '@ui/components/List';
  import { withListBox } from './withListBox';

  const ListBox = withListBox(List);
*/

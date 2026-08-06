## Due to accessibility we need to have a separate aria-xx attributes for case when having search input

inside dropdown & when not having it.

### [simplified] Case when search input inside dropdown:

- dropdown container is of role="dialog"
- trigger "aria-controls" this dropdown container element
- search input of role="combobox" inside dropdown
- search input "aria-controls" listbox inside the dropdown
- labels are passed directly to search input

```jsx

<span id="label_id">Label of the input</span>
<button
  id="trigger_id"
  role="combobox"
  aria-expanded="true"
  aria-haspopup="dialog"
  aria-autocomplete="none"
  aria-controls="dialog_id"
  aria-labelledby="label_id"
>...</button>
<div
  id="dialog_id"
  role="dialog"
  aria-labelledby="label_id"
>
  <input
    id="search_id"
    role="combobox"
    autocomplete="off"
    aria-autocomplete="list"
    aria-haspopup="listbox"
    aria-expanded="true"
    aria-controls="listbox_id"
    aria-activedescendant="active_option_id"
  />
  <div
    id="listbox_id"
    role="listbox"
  >
    <div
      id="active_option_id"
      role="option"
      aria-selected="true"
	  >...</div>
    <div
      id="other_option_id"
      role="option"
      aria-selected="false"
    >...</div>
  </div>
</div>
```

### [simplified] Case when no search input inside dropdown:

- dropdown container is of role="listbox"
- trigger "aria-controls" this listbox element
- labels are passed directly to this listbox element

```jsx

<span id="label_id">Label of the input</span>
<button
  id="trigger_id"
  role="combobox"
  aria-expanded="true"
  aria-haspopup="listbox"
  aria-autocomplete="none"
  aria-controls="listbox_id"
>...</button>
<div
  role="presentation"
>
  <div
    id="listbox_id"
    role="listbox"
    aria-labelledby="label_id"
    aria-activedescendant="active_option_id"
  >
    <div
      id="active_option_id"
      role="option"
      aria-selected="true"
    >...</div>
    <div
      id="other_option_id"
      role="option"
      aria-selected="false"
    >...</div>
  </div>
</div>

```

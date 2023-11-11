# CheatFramework
A cheat base for hacking browser games!
Supports 4 config types:
```
some_random_checkbox: {
  type: 0, //0 is checkbox
  defaultValue: true, //optional value for defaults
},
some_random_dropdown: {
  type: 1, //1 is dropdown
  defaultValue: "69", //optional value for defaults
  possibleValues: ["420","69","-1","0"] //dropdown list
},
some_random_text_input: {
  type: 2, //2 is text input
  defaultValue: "hi!", //optional value for defaults
},
some_random_slider: {
  type: 3, //3 is slider
  defaultValue: 50, //optional value for defaults
  min: 0, //min value
  max: 100, //max value
}
```
Also has a Keybind system:

`<menu>` - gui menu

`[category].[config name]` - toggle config for specific category. Be warned, it is indended to be used only for checkboxes!

Not gonna write a complete documentation (there's definitely more stuff to cover) right now. Just look around in the code and be sure to make edits where allowed to ensure that you won't break anything

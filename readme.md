# Clipboard Prototype

This is a prototype for interacting with the Clipboard in HTML5. Prototype should include:

1. Synchronous Clipboard Api
2. Asynchronous Clipboard Api
3. document.Exec
4. intercepting raw `ctrl-c` and `ctrl-v` commands

## Behaviors

Cut has a variety of implementations:

1. In spreadsheet editors, "Cutting" marks the data for cut and then deletes it AFTER it is pasted. This is undone by hitting the 'esc' key, copying other data, or cutting other data. Ctrl-z in this workflow does nothing until AFTER the paste/delete events fire
2. Word Editors will delete the data immediately. Most other applications behave this same way. Tis is undone by hitting `ctrl-z` / `undo` key; which will remove the pasted data AND re-add the cut data. Native browser behave this way

Note: Browers will not allow you to "Cut" "Uncuttable" content, e.g. if you "Cut" a paragraph, nothing will happen
Some other nuances of cut, not all programs delete the "Cut" buffer.

1. Some programs will clear the "cut" buffer after a "paste" event
2. Some programs will persist the buffer, allowing you to paste something "cut" multiple times

I believe my favoured implementations are #2 for both options.

## Findings

So far, it seems that the clipboard api will not function from within a non-interactive element natively. This means the implementation has to:

1. Inside of a canvas, provide your own `Clipboard` to copy/paste app/canvas elmements natively
2. When a user COPIES or CUTS an element from your `Canvas`, write it into your own clipboard
3. Whenever you cut/copy an object from within the canvas, you must delete the current clipboard contents (and ideally replace with a reference to yours)
4. Whenever someone cut/copies an object from outside of the canvas, you must clear your internal canvas
  Note: This DOES NOT require permissions

Considerations:

- If someone denies your app permissions, there will be two clipboards when pasting INSIDE of your canvas. E.g.
  - Copy an internal canvas element
  - Paste it normally
  - Copy something outside of the canvas
  - Attempt to paste it within the canvas, your PREVIOUSLY copied element will be pasted again


## Unanswered Questions

- How did "legacy" webapps like Roll20, Facebook, & Discord support the clipboard?
- Do I even need to use the Clipboard Api?
  - Browser natively

## When to use Webgl or Html/CSS

- I need to determine when to use a canvas element, and when do use native complex html /css
  - using native html/css for GUIs is better
  - but they need to be "Bolted" on seamlessly
- Are there any instances of me wanting to make an interface WITHIN the game space itself? Most interfaces are just 2d flat interfaces...

## Reasons for needing to figure this out:

- Take advantage of existing CSS animations, new HTML features (Drag and Drop)
- Avoid having to recreate simple interfaces in webgl

## Resources

- [Actual W3 Spec](https://www.w3.org/TR/clipboard-apis/)
- [MDN Clipboard Reference](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [StackOverflow](https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript)
- [Google Support](https://developers.google.com/web/updates/2018/03/clipboardapi)
- [MDN OnPaste Documentation](https://developer.mozilla.org/en-US/docs/Web/Events/paste)
- [Javascript HTML clipboard library](https://github.com/zenorocha/clipboard.js)
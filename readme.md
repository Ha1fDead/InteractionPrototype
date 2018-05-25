# Interaction Prototypes

This project houses my prototypes for "Core" interaction examples, including:

1. Drag and Drop
2. Copy and Paste
3. Clipboard
4. Context Menu
5. Touch Events and Mobile Handling

This is a base project for my overall "Valhalla" project.

## Setting Up Project

- [use this command](https://stackoverflow.com/questions/35127383/npm-http-server-with-ssl)
- [copy this openssl conf file](http://web.mit.edu/crypto/openssl.cnf)

```Powershell
Code\Valhalla\Prototypes\Clipboard> openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem -config .\openssl.conf
```

## Deploying

I use Github Pages to demonstrate this code (because its really simple). I host it out of the branch `gh-pages`. Simply cd into the branch, and run:

1. `git pull origin master`
2. `tsc`
3. `git push`

In my experience it takes a few moments for Github to stop caching the old pages. To get this working, I simply included the compiled source code into the deployment; so this branch is significantly larger than the master branch.

## Draggable Prototypes

Should I consider using Shopify's [Draggable](https://github.com/Shopify/draggable#documentation)?

Example Drag Interactions:

- drag an item from inventory into canvas
- drag an item from canvas into inventory
- drag an actor from canvas into play space
- move an actor within the canvas from one tile to another
- drag a texture onto a tile
- drag an object onto a table or surface

## Clipboard Prototype

This is a prototype for interacting with the Clipboard in HTML5. Prototype should include:

1. Synchronous Clipboard Api
2. Asynchronous Clipboard Api
3. document.Exec
4. intercepting raw `ctrl-c` and `ctrl-v` commands

### Clipboard Behaviors

If you attempt to "copy" empty data, then the clipboard should not copy "empty" and preserve the previous contents.

Cut has a variety of implementations:

1. In spreadsheet editors, "Cutting" marks the data for cut and then deletes it AFTER it is pasted. This is undone by hitting the 'esc' key, copying other data, or cutting other data. Ctrl-z in this workflow does nothing until AFTER the paste/delete events fire
2. Word Editors will delete the data immediately. Most other applications behave this same way. Tis is undone by hitting `ctrl-z` / `undo` key; which will remove the pasted data AND re-add the cut data. Native browser behave this way

Note: Browers will not allow you to "Cut" "Uncuttable" content, e.g. if you "Cut" a paragraph, nothing will happen
Some other nuances of cut, not all programs delete the "Cut" buffer.

1. Some programs will clear the "cut" buffer after a "paste" event
2. Some programs will persist the buffer, allowing you to paste something "cut" multiple times

I believe my favoured implementations are #2 for both options.

## Command Prototype

Command Pattern, also known as Undo / Redo, has some interesting behaviors. I need to think about what is "Undoable" from a users perspective.

Google Sheets:

- Undo will switch your tab to that window, and then undo the item
- Conditional formatting is undoable (whoda thunk)

Valhalla:

- Actor / Prop manipulation (placing, moving, resizing, scaling, etc.)
- Resource expenditure (casting a spell, rolling hit dice)
- Entire AI turns
- Player actions (doing damage, casting a spell, etc.)
- Drawing (for drawing tools)
- UI management (open window, close window, minimize window)

What shouldn't be undoable:

- System Configuration

Behaviors / Unkowns:

- User moves something, changes the health, and moves it again. Should two undos undo the move actions or the move and health change?
- Can the GM undo player actions?
- Can the players undo GM actions?
- What about item transferrence (player drops item, player #2 picks it up, player #1 undoes action)

## Browser Behaviors

Regarding the asynchronous APIs, it appears that (in Chrome)

- You can always set data into the clipboard without explicit permissions
- Reading from the clipboard asynchronously always requires permissions

## Resources

- [Actual W3 Spec](https://www.w3.org/TR/clipboard-apis/)
- [MDN Clipboard Reference](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [StackOverflow](https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript)
- [Google Support](https://developers.google.com/web/updates/2018/03/clipboardapi)
- [MDN OnPaste Documentation](https://developer.mozilla.org/en-US/docs/Web/Events/paste)
- [Javascript HTML clipboard library](https://github.com/zenorocha/clipboard.js)
- [MDN Draggable Documentation](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
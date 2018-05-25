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

## Architecture Decisions

My overall architecture, derived from this prototype, should be:

- UI should be completely separate from game space
- UI should replay game space actions themselves
- Game space shouldn't have any knowledge of UI, I think, for clean separation
- UI will get a little messy, that's fine

houses core UX and interfacing with browsers and browser events
OS/browser/layout specific functionality should reside here

(All of the below are nested under a "UI" folder)

- Data (Responsible for storage, network communication of game logic, etc.)
- GameLogic (Repsonsible for core game rules, interacting with actors, taking damage, taking turns, etc.)
  - System (info regarding system-specific rules and logic)
- UserActions (Every user action goes here, things that are undoable/redoable, or listable via '/')
  - e.g. "pickup item", "attack", "activate ability", "open window", "fire macro"
- UI (All UI interactions, rendering, components, etc.)
  - uimanagers
    - uimanager
    - touchmanager
    - clipboardmanager
    - clickmanager
    - keyboardmanager
    - contextmanager
  - interfacecontexts
    - Canvas
    - Inventory
    - RosterTracker
  - draganddrop
  - clipboard
  - contextual
  - touchable
  - undoredo

Unknown architecture decisions:

- Where does manipulating core stats belong? E.g. I open the Character sheet, and change the max health of an actor from 3 to 4. Where does that logic go?
  - Naively, you could put it in the UI layer
  - Fizzbuzz enterprizey, you can put it in a user action (it would need to go here anyway for undo/redo)
  - I think putting it in this "UserAction" layer is better because I want it to be undoable anyway. So no matter what, it needs to flow down into some kind of command.
- Where do I pipe user actions into the system?
  - action's aren't restricted to "select item"; but can also include game-specific actions, such as "five foot step"
- How do I pipe the undoredo commands into the stack?
  - with AI, I could mirror the selection behavior somehow. But then AI needs to live in or above the UI layer
- How do I pipe game rendering logic into the contexts?

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

## Undo/Redo Command Prototype

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

What shouldn't be undoable:

- System Configuration
- UI management (open window, close window, minimize window)

Behaviors / Unkowns:

- If the user "undos" or "redos" an action centered on a window that has been closed or minimized, the undo/redo should attempt to re-open / maximize that window.
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
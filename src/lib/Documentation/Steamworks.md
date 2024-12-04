# Steamworks

The Steamworks extension lets you use a wide range of Steam APIs:

 - Basic user information (name, id, level, country)
 - Achievements
 - DLC
 - Opening URLs in the Steam Overlay
 - Session tickets
 - Subscription status
 - Cloud storage
 - Input handling
 - Matchmaking
 - Networking
 - Stats
 - Workshop items

This extension was not created by and is not supported by Valve. This extension should be considered **beta** until some real games use it.

## Enabling Steamworks

The Steamworks SDK will be automatically downloaded and enabled when a project using the Steamworks extension is put into the [PenguinMod Packager](https://studio.penguinmod.com/PenguinMod-Packager/). You'll be asked to provide your game's App ID, which you can find on the Steamworks website. If you don't have an App ID yet, [use the demo game](#demo-game). You will also need to select one of these environments:

 - Electron Windows application (64-bit)
 - Electron macOS application
   (Warning: macOS games published on Steam need to be notarized by Apple, which the packager doesn't support. You can still test your game on a Mac, but you won't be able to publish it for macOS yet.)
 - Electron Linux application (64-bit)

You may have to look under "Other environments" to find some of these. The blocks will not work in the editor, 32-bit environments, ARM environments, plain HTML files, WKWebView, or NW.js. You can still run the blocks, they just won't interact with Steam at all.

You can run the packaged executable directly as usual; you don't need to start the game from Steam for the Steamworks extension to function. However, there are a couple of caveats when doing this:

 - On macOS and Linux, when not started through Steam, the Steam Overlay may not work
 - On Linux, when not started through Steam, Steamworks may not work if Steam is installed from Flatpak/Snap instead of as a native package

## Security considerations

Using the Steamworks extension will not prevent people from pirating your game.

The Steamworks extension is also inherently client-side, so a cheater could manipulate all of the Steamworks blocks to return whatever they want. You shouldn't use them for things that are security critical.

## Demo game <a name="demo-game"></a>

To test the Steamworks extension without paying for a Steamworks Partner Program membership, you can use the Steamworks demo game. It's called Spacewar and its App ID is `480`. You don't need to install or run Spacewar; rather, you can use its App ID to test various Steamworks APIs as if you were the Spacewar developers.

Spacewar has achievements with the following API Names, which can be used for testing the achievement blocks:

 - `ACH_WIN_ONE_GAME`
 - `ACH_WIN_100_GAMES`
 - `ACH_TRAVEL_FAR_ACCUM`
 - `ACH_TRAVEL_FAR_SINGLE`

## Basic Information

Remember that Steamworks is only properly enabled when your project is packaged in a few specific environments. You can detect if this is the case using:

```scratch
<has steamworks? :: #136C9F>
```

This block returns `true` if the Steamworks SDK is available and functional, allowing you to conditionally run Steam-specific code.

Then you can get basic information about the user using:

```scratch
(get user (name v) :: #136C9F)
```

This block lets you retrieve different pieces of user information:
- `name`: The Steam username of the player.
- `steam ID`: The unique Steam ID of the player.
- `level`: The Steam account level of the player.
- `IP country`: The country code based on the player's IP address.

## Achievements

Achievements are created on the Steamworks website. The **API Name** of each achievement is what you need to provide in your project's code to the Steamworks extension.

This would unlock the `ACH_WIN_ONE_GAME` achievement from Spacewar:

```scratch
when this sprite clicked
set achievement [ACH_WIN_ONE_GAME] unlocked to (true v) :: #136C9F
```

This block sets the unlocked status of an achievement to `true` or `false`.

You can also detect if an achievement has already been unlocked:

```scratch
when flag clicked
forever
    if <achievement [ACH_WIN_ONE_GAME] unlocked? :: #136C9F> then
        say [Unlocked!]
    else
        say [Not unlocked :(]
    end
end
```

This block checks if the specified achievement has been unlocked.

## DLC

Each DLC has its own App ID which you can find on the Steamworks website. You can detect if it is installed using:

```scratch
if <(DLC v) [1234] installed? :: #136C9F> then

end
```

This block checks if the specified DLC (by its App ID) is installed on the user's system.

## Overlay

The Steamworks extension has a block to open URLs in the Steam Overlay's web browser. If the overlay is not working, it might open in the Steam app instead. If that also doesn't work, it will open in the default web browser. Regardless, packaged projects never display security prompts like "The project wants to open a new window or tab".

```scratch
open (URL v) [https://example.com/] in overlay :: #136C9F
```

This block opens the specified URL in the Steam Overlay browser, if available, otherwise in the default browser.

## Session Tickets

Session tickets can be retrieved using the following blocks, which are useful for authentication purposes:

```scratch
get session ticket with Steam ID [STEAMID] and timeout [TIMEOUT] :: #136C9F
get session ticket with IP [IP] and timeout [TIMEOUT] :: #136C9F
get auth ticket for web API with identity [IDENTITY] and timeout [TIMEOUT] :: #136C9F
```

- `get session ticket with Steam ID`: Retrieves a session ticket for a specific Steam ID, useful for verifying the identity of a user.
- `get session ticket with IP`: Retrieves a session ticket based on the user's IP address.
- `get auth ticket for web API`: Retrieves an authentication ticket for a specific web API identity.

## Subscription Status

Check the subscription status of an app or whether the user is banned, in a cybercafe, or in low violence mode:

```scratch
is subscribed app [APPID]? :: #136C9F
is app [APPID] installed? :: #136C9F
is VAC banned? :: #136C9F
is cybercafe? :: #136C9F
is low violence? :: #136C9F
is subscribed? :: #136C9F
```

- `is subscribed app`: Checks if the user is subscribed to the specified app (by App ID).
- `is app installed`: Checks if the specified app is installed on the user's system.
- `is VAC banned`: Checks if the user is banned by Valve Anti-Cheat (VAC).
- `is cybercafe`: Checks if the user is playing from a cybercafe.
- `is low violence`: Checks if the user is in low violence mode.
- `is subscribed`: Checks if the user is subscribed to the current app.

## Cloud Storage

Interact with the Steam Cloud to check if cloud storage is enabled and list files:

```scratch
is cloud enabled for account? :: #136C9F
is cloud enabled for app? :: #136C9F
list cloud files :: #136C9F
```

- `is cloud enabled for account`: Checks if cloud storage is enabled for the user's account.
- `is cloud enabled for app`: Checks if cloud storage is enabled for the current app.
- `list cloud files`: Lists all files stored in the Steam Cloud for the current app.

## Input Handling

Initialize input, get controllers, action sets, and shut down input handling:

```scratch
initialize input :: #136C9F
get controllers :: #136C9F
get action set [ACTIONSET] :: #136C9F
get digital action [ACTION] :: #136C9F
get analog action [ACTION] :: #136C9F
shutdown input :: #136C9F
```

- `initialize input`: Initializes Steam Input, enabling the use of controllers.
- `get controllers`: Retrieves a list of connected controllers.
- `get action set`: Gets the action set for the specified name.
- `get digital action`: Gets the digital action (e.g., button press) for the specified action name.
- `get analog action`: Gets the analog action (e.g., joystick movement) for the specified action name.
- `shutdown input`: Shuts down Steam Input.

## Matchmaking

Create and join lobbies, and retrieve lobby information:

```scratch
create lobby of type [LOBBYTYPE] with max members [MAXMEMBERS] :: #136C9F
join lobby [LOBBYID] :: #136C9F
get lobbies :: #136C9F
```

- `create lobby`: Creates a new lobby with the specified type and maximum number of members.
- `join lobby`: Joins an existing lobby by its ID.
- `get lobbies`: Retrieves a list of available lobbies.

## Networking

Send and accept P2P packets:

```scratch
send P2P packet to [STEAMID] with type [SENDTYPE] and data [DATA] :: #136C9F
accept P2P session from [STEAMID] :: #136C9F
```

- `

send P2P packet`: Sends a P2P packet to the specified Steam ID with the given type and data.
- `accept P2P session`: Accepts a P2P session from the specified Steam ID.

## Stats

Get, set, and store game stats, and reset all stats and achievements:

```scratch
get stat [NAME] :: #136C9F
set stat [NAME] to [VALUE] :: #136C9F
store stats :: #136C9F
reset all stats and achievements [ACHIEVEMENTSTOO] :: #136C9F
```

- `get stat`: Retrieves the value of the specified stat.
- `set stat`: Sets the value of the specified stat.
- `store stats`: Stores the current stats to Steam.
- `reset all stats and achievements`: Resets all stats and optionally achievements.

## Workshop Items

Create, update, subscribe to, and manage workshop items:

```scratch
create workshop item for app [APPID] :: #136C9F
update workshop item [ITEMID] with details [DETAILS] for app [APPID] :: #136C9F
update workshop item [ITEMID] with details [DETAILS] for app [APPID], success [SUCCESS], error [ERROR], progress [PROGRESS], interval [INTERVAL] :: #136C9F
subscribe to workshop item [ITEMID] :: #136C9F
unsubscribe from workshop item [ITEMID] :: #136C9F
get workshop state for item [ITEMID] :: #136C9F
get install info for workshop item [ITEMID] :: #136C9F
get download info for workshop item [ITEMID] :: #136C9F
download workshop item [ITEMID] with high priority [HIGHPRIORITY] :: #136C9F
get subscribed workshop items :: #136C9F
get workshop item [ITEM] with query config [QUERYCONFIG] :: #136C9F
get workshop items [ITEMS] with query config [QUERYCONFIG] :: #136C9F
get all workshop items for page [PAGE], query type [QUERYTYPE], item type [ITEMTYPE], creator appId [CREATORAPPID], consumer appId [CONSUMERAPPID], query config [QUERYCONFIG] :: #136C9F
get user workshop items for page [PAGE], account ID [ACCOUNTID], list type [LISTTYPE], item type [ITEMTYPE], sort order [SORTORDER], creator appId [CREATORAPPID], consumer appId [CONSUMERAPPID], query config [QUERYCONFIG] :: #136C9F
```

- `create workshop item`: Creates a new workshop item for the specified app.
- `update workshop item`: Updates the specified workshop item with the given details.
- `update workshop item with callback`: Updates the specified workshop item with the given details and calls the success, error, and progress callbacks at the specified intervals.
- `subscribe to workshop item`: Subscribes to the specified workshop item.
- `unsubscribe from workshop item`: Unsubscribes from the specified workshop item.
- `get workshop state`: Retrieves the state of the specified workshop item.
- `get install info`: Retrieves the install information for the specified workshop item.
- `get download info`: Retrieves the download information for the specified workshop item.
- `download workshop item`: Downloads the specified workshop item with the option to set high priority.
- `get subscribed workshop items`: Retrieves a list of subscribed workshop items.
- `get workshop item`: Retrieves the specified workshop item with the given query configuration.
- `get workshop items`: Retrieves the specified workshop items with the given query configuration.
- `get all workshop items`: Retrieves all workshop items for the specified page, query type, item type, creator app ID, consumer app ID, and query configuration.
- `get user workshop items`: Retrieves the user’s workshop items for the specified page, account ID, list type, item type, sort order, creator app ID, consumer app ID, and query configuration.

## Miscellaneous

Other useful blocks:

```scratch
get app build ID :: #136C9F
get app install directory for app [APPID] :: #136C9F
get app owner :: #136C9F
get available game languages :: #136C9F
get current game language :: #136C9F
get current beta name :: #136C9F
get server real time :: #136C9F
is Steam running on Steam Deck? :: #136C9F
show gamepad text input with mode [INPUTMODE], line mode [LINEMODE], description [DESCRIPTION], max characters [MAXCHARS], existing text [EXISTINGTEXT] :: #136C9F
show floating gamepad text input with keyboard mode [KEYBOARDMODE], x [X], y [Y], width [WIDTH], height [HEIGHT] :: #136C9F
```

- `get app build ID`: Retrieves the build ID of the app.
- `get app install directory`: Retrieves the install directory of the specified app.
- `get app owner`: Retrieves the Steam ID of the app owner.
- `get available game languages`: Retrieves the available game languages.
- `get current game language`: Retrieves the current game language.
- `get current beta name`: Retrieves the current beta name, if any.
- `get server real time`: Retrieves the real-time clock of the Steam server.
- `is Steam running on Steam Deck`: Checks if Steam is running on a Steam Deck.
- `show gamepad text input`: Shows the gamepad text input with the specified mode, line mode, description, maximum characters, and existing text.
- `show floating gamepad text input`: Shows the floating gamepad text input with the specified keyboard mode, position (x, y), and size (width, height).

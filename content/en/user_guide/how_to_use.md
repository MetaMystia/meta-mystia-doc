# How to use

This page explains the basic in-game operations and how to play together once MetaMystia is installed.

If you are not familiar with computer networks or the idea of "commands", don't worry — just follow the steps and you can get online with your friends.

Before you start, every player must have MetaMystia installed and must have entered the game's main menu at least once. If you use ResourceEx content, everyone should also install the same version of the resource pack.

## Choosing how to connect

MetaMystia supports two ways to play together:

| Mode        | When it fits                                                                   | Main commands                        |
| ----------- | ------------------------------------------------------------------------------ | ------------------------------------ |
| Server mode | You are not on the same LAN and do not want to set up a networking tool        | `/mp play`, `/mp create`, `/mp join` |
| LAN mode    | You are on the same LAN, or already set up a network with Tailscale or similar | `/mp start`, `/mp connect`           |

Both modes play the same way; only creating and joining a room differ.

## Preparation: set your player name

Every player presses <kbd>/</kbd> to open the command box and enters:

```text
/mp id PlayerName
```

`PlayerName` is the name shown to other players; replace it with your own name. Names cannot contain spaces, and cannot duplicate another player's name in the room. If you do not set one, your computer name is used.

## Server mode {#server_mode}

### Creating a room

One player connects to the test play server and creates a room:

```text
/mp play
/mp create 4
```

`4` means up to 4 players including the player who created the room; change it to the number you need. When the room is created, the console shows a 4-character room code, for example `AB20`. Send the room code to the other players.

### Joining a room

The other players enter:

```text
/mp play
/mp join AB20
```

Replace `AB20` with the actual room code; upper and lower case both work. If you do not know the room code, run `/mp rooms` after connecting to the server to see the rooms on it.

### Leaving a room

Run `/mp leave` to leave the current room while staying connected to the server; you can then create or join another room. When the player who created the room leaves, the room is disbanded: the others leave the room but stay connected to the server.

Run `/mp disconnect` to disconnect from the server completely.

## LAN mode

### Step 1: Set the player limit

A room holds up to 2 players by default, including the host. To play with three or more, the host enters:

```text
/mp maxplayers 4
```

The `4` above means up to 4 players; change it to the number you need.

### Step 2: The host opens a room

The host enters:

```text
/mp start
```

After running `/mp start`, the host needs to send their IP address to the other players. If you are not on the same local network, first set up a networking tool such as Tailscale or ZeroTier, then send the IP shown by that tool; you can also switch to [server mode](#server_mode).

### Step 3: Other players join

Each joining player enters:

```text
/mp connect host IP
```

For example:

```text
/mp connect 192.168.1.10
```

Once connected, you enter the host's room automatically. When the host quits, multiplayer ends and a new room must be opened.

## Playing together

After connecting, press <kbd>Enter</kbd> to open the player list. It shows the host, the other players, and what everyone is currently doing.

> [!NOTE]
> Other players can join or reconnect only while everyone in the room is at the main menu or during the day, and the host has not finished the day yet. Please gather everyone at the main menu or during the day before continuing.

- Daytime: everyone uses their own save file and does daytime activities separately. Play continues only after all players have finished the day.
- Choosing a shop: all players must pick the same shop and level.
- Before opening: everyone picks a menu, beverages, and cookware separately; the shift starts only after all players confirm.
- Shift: you can split the work: cooking, picking up ingredients, serving dishes, and greeting guests.

If someone leaves in the middle, the remaining players continue automatically once they finish the current flow. If the pre-opening setup stays stuck on the waiting screen, the host can confirm their own setup and enter:

```text
/mp continue prep
```

After that every player counts as confirmed and the shift starts right away.

## Chat and player list

The keys below are MetaMystia's defaults. If you changed the mod's configuration, your own settings take precedence.

| Key                         | Action                                                                |
| --------------------------- | --------------------------------------------------------------------- |
| <kbd>T</kbd>                | Open the chat input                                                   |
| <kbd>/</kbd>                | Open the command input                                                |
| <kbd>Enter</kbd>            | Input closed: show/hide the player list; input open: send the message |
| <kbd>Esc</kbd>              | Close the input                                                       |
| <kbd>&#92;</kbd>            | Show/hide the status text in the bottom-left corner                   |
| <kbd>Tab</kbd>              | Complete the command                                                  |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Browse previously entered commands                                    |

In chat, just type your message; anything starting with `/` is treated as a command. The player list and chat window can be dragged around.

## Connecting on a LAN

If setting up a network is inconvenient, you can use [server mode](#server_mode) instead.

- Same Wi-Fi or LAN: use the host's LAN IP.
- Different networks: use a tool such as Tailscale or ZeroTier to put all players into one virtual LAN.
- The host has a public IP: open the port in the firewall and router, then connect directly.

MetaMystia uses port `40815` by default. To change it, the host and every other player must use the same port:

```text
/mp start 50000
```

Other players use either form:

```text
/mp connect 192.168.1.10:50000
/mp connect 192.168.1.10 50000
```

Most players do not need to change IPv6 settings. If you really are on an IPv6 network, see [Commands](./commands.md) for the related commands.

## What to check if you cannot connect

Check in order:

1. Does everyone have the same game and MetaMystia version?
2. Has everyone entered the main menu at least once, with the MetaMystia status text visible in the bottom-left?
3. In server mode, has everyone connected with `/mp play`, and is the room code correct?
4. In LAN mode, has the host run `/mp start`, and are the IP and port entered by the others correct?
5. Is the room full, or is a player name duplicated or containing spaces?
6. Has anyone in the room entered the pre-opening setup or started the shift, or has the host already finished the day?
7. Is the firewall, router, or networking tool blocking the connection?

Run `/mp status` to see the current connection state. If it still does not work, see [FAQ](./faq.md).

## Getting help {#get_help}

You can report problems through [GitHub Issues](https://github.com/MetaMystia/MetaMystia/issues). To help us pinpoint the issue, please provide:

- the symptoms and the steps you took;
- every player's versions of the game, MetaMystia, DLC, and resource packs;
- screenshots of error messages;
- every player's `game root folder/BepInEx/LogOutput.log`;
- how you are connecting, for example the same LAN, Tailscale, or port forwarding.

If you use the manager tool, you can also attach the diagnostic package it exports: run the tool, choose **Export diagnostic package** on the "Select action" page, and follow the prompts. When it finishes, the tool shows the archive path; you can also click "Open containing folder" to jump straight to it.

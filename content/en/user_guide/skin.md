# Skin system

The skin system can replace your local character appearance and sync the choice to the other players in the room. It supports the game's original characters and outfits, DLC and ResourceEx characters and outfits, and online skins downloaded from the skin site.

## Game and ResourceEx skins

First run `/skin list` to see the character IDs, types, and indexes available in your environment, then use:

```text
/skin set <characterId> <Default|Explicit|DLC> <skinIndex>
```

For example:

```text
/skin set 21 Explicit 0
```

![Example character skin](./skin.assets/image-20260330221731828.png)

If you own the matching DLC, you can also pick DLC characters:

```text
/skin set 2006 Default 0
```

![Example DLC character skin](./skin.assets/image-20260330222239839.png)

Running `/skin off` clears manual overrides and restores the game's default appearance. Skins sync in multiplayer, but other players must own the corresponding game, DLC, or ResourceEx content for locally provided skins to display correctly.

## Online skins

Online skins are downloaded by name from the skin site:

```text
/skin net <name>
```

A placeholder appearance is shown until the download finishes. `/skin net refresh` clears the current skin cache and downloads it again, and `/skin net off` turns the online skin off.

The names documented here are listed below; what the skin site actually provides may change at any time.

|   Name    |                Preview                |
| :-------: | :-----------------------------------: |
| `DMShion` | ![DMShion](./skin.assets/DMShion.png) |
| `DMJyoon` | ![DMJyoon](./skin.assets/DMJyoon.png) |
| `DMUrumi` | ![DMUrumi](./skin.assets/DMUrumi.png) |
|   `Box`   |     ![Box](./skin.assets/Box.png)     |
|  `Ball`   |    ![Ball](./skin.assets/Ball.png)    |
|   `AQ`    |      ![AQ](./skin.assets/AQ.png)      |
|   `Bun`   |     ![Bun](./skin.assets/Bun.png)     |
|  `Stone`  |   ![Stone](./skin.assets/Stone.png)   |
|   `Cat`   |     ![Cat](./skin.assets/Cat.png)     |
|   `Dog`   |     ![Dog](./skin.assets/Dog.png)     |
| `Kedama`  |  ![Kedama](./skin.assets/Kedama.png)  |

## Rotation override

Some sprites need to override the character's rotation behavior:

```text
/skin rot on
/skin rot off
/skin rot clear
```

`clear` removes the manual override and immediately restores the skin's or the game's own rotation settings.

See [Commands](./commands.md) for the full command reference.

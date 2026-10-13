# Hello World, Part 2

Through a concrete example, this section shows how to audit game logic and find the function entry point you need. The example does not apply directly to every game, but the method — extract clues from visible behavior, then verify with types, signatures, and call relationships — is general. Here the goal is to find the function in Touhou Mystia's Izakaya that shows the bottom-left notification, and make it display `Hello World!`.

## Prerequisites

Before you start, make sure you have completed everything in [Getting started](./getting_started.md). The difficulty of auditing game logic depends on the original game's architecture, naming conventions, compiler optimizations, and code obfuscation. Touhou Mystia's Izakaya keeps type and member names fairly clear, so you can narrow the search step by step from UI behavior, call relationships, and type names. Audit results should still be verified against the decompiled code, the interop assemblies, and actual runtime behavior.

## Overall audit

Before locating anything, observe the project's naming conventions and module layout. The relevant types in Touhou Mystia's Izakaya are mainly distributed across namespaces such as `Common`, `DayScene`, `GameData`, `MainScene`, and `NightScene`. UI-related types often contain `UI`, DLC-related types often contain `DLCx`, and game data is mainly concentrated in `GameData`.

![image-20260601123546708](./hello_world_2.assets/image-20260601123546708.png)

## Analyzing the game logic

When locating a feature, first note its trigger conditions, inputs and outputs, and the possible call sites. For the bottom-left notification, we get the following clues:

1. It needs a string as input.
2. Multiple notifications are shown at the same time, with an order and their own lifetimes.
3. Notifications often appear at points such as quest start and quest end, so you can search backwards from those call sites for the display function.
4. Besides plain-text notifications, there are notifications with icons; these features may share the underlying display component, so you can keep searching through neighboring types and overloads.
5. The notification exists not only in DayScene but also in NightScene.

![image-20260601123641378](./hello_world_2.assets/image-20260601123641378.png)

![image-20260601123705298](./hello_world_2.assets/image-20260601123705298.png)

![image-20260601123803783](./hello_world_2.assets/image-20260601123803783.png)

## Auditing the code

Based on these clues, you can search in the following directions:

1. Related to UI, so possibly a class in a namespace containing `UI`.
2. Related to notifications, so possibly a class in a namespace containing `Notify`, `Message`, `Toast`, and so on.
3. Independent of the scene, so possibly present in both DayScene and NightScene, or directly in Common.
4. There will be many variants: some take a single string, others take several parameters to show different notifications.
5. There are many call situations; if you are familiar with the trigger conditions and call relationships of other notifications, you can confirm by looking up the call relationships.

In the current analysis, the target type is `Common.UI.ReceivedObjectDisplayerController`, and the signature of its member function `NotifyTextMessage` is `public void NotifyTextMessage(string content)`.

![image-20260601124449894](./hello_world_2.assets/image-20260601124449894.png)

The type inherits from `DEYU.Singletons.MonoSingleton<Common.UI.ReceivedObjectDisplayerController>`, so you can get the instance through its `Instance` property and call the member function.

To test it, we add the following code in `PluginManager.Update`:

```csharp
if (Input.GetKeyDown(KeyCode.F2)) // 按下 F2 键
{
	Common.UI.ReceivedObjectDisplayerController.Instance.NotifyTextMessage("Hello World!");
}
```

![image-20260601124804831](./hello_world_2.assets/image-20260601124804831.png)

The build then reports the following error:

> error CS0012: The type 'MonoSingleton<>' is defined in an assembly that is not referenced. You must add a reference to assembly 'DEYU.Singletons, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null'.

So we add the reference `BepInEx/interop/DEYU.Singletons.dll` and build again. Once the build succeeds, launch the game and press <kbd>F2</kbd>; you should see our Hello World notification pop up in the bottom-left corner.

![image-20260601125221011](./hello_world_2.assets/image-20260601125221011.png)

## Hook assistance

If calling the function directly is difficult, you can also add a hook with `HarmonyPatch` and use logs to confirm whether the target function runs at the expected time. The hook location and the choice of `Prefix` and `Postfix` must be based on the actual call chain, not just the function name.

## AI assistance

AI can help search candidate types, organize call relationships, and produce audit notes, but the member names, signatures, and call conclusions it gives must be verified against the reversed code, the interop assemblies, or actual runtime results.

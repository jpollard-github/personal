# Between Two Lodges

`Between Two Lodges` is a local, browser-based text adventure and non-commercial fan homage inspired by the mood and broad mystery shape of Twin Peaks. It uses original prose and does not quote copyrighted dialogue from the series or film.

## How to run

Open `index.html` in any modern browser. There is no backend, build step, API call, package install, or external dependency.

## How the scene system works

All game content lives in the `scenes` object in `game.js`. Each scene has:

- `id`: unique scene key.
- `chapter`: chapter label shown in the sidebar.
- `title`: scene heading.
- `text`: an array of paragraph strings.
- `choices`: clickable options that point to other scene ids.
- `effects`: optional state changes applied once when the scene is first visited.

Effects can add inventory, add clues, change `intuition` or `darkness`, and set flags. Choices can include `requires` gates such as an item, clue, flag, or minimum intuition score.

## How to add scenes

Add a new entry to the `scenes` map in `game.js`, then point to it from an existing scene choice:

```js
new_scene_id: {
  id: "new_scene_id",
  chapter: "Dreams",
  title: "A New Dream",
  text: ["Original scene prose goes here."],
  effects: { addClue: ["new clue"], intuition: 1 },
  choices: [
    { text: "Return to the woods.", next: "woods_owl" }
  ]
}
```

To lock a choice, add a `requires` object:

```js
{ text: "Use the hidden diary fragment.", next: "outside_time", requires: { item: "hidden diary fragment" } }
```

## Save and load

The game automatically saves progress to `localStorage` under the key `betweenTwoLodgesSave`. Refreshing the page restores the current scene, inventory, clues, meters, visited scenes, and flags.

The `Restart` button clears the run by replacing the current state with the initial state and saving it again.

## Fan homage note

This is a non-commercial fan-style homage. It uses familiar kinds of places, moods, and mystery beats associated with Twin Peaks, but it is an original text adventure with original prose and no copied episode or movie dialogue.

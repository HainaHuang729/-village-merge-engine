# PLAYTEST

This document records MVP playtest checks for Village Merge.

## Automated MVP Flow

Status: passed by `games/village-merge/tests/mvp-flow.test.ts`.

Covered flow:

```text
Starting board + truck cargo
-> Egg merge
-> Chick merge
-> Chicken merge
-> Chicken Coop
-> Coop leaves board
-> Village owns chicken_coop
```

The test proves the current content configuration can complete the first coop without adding another chain or economy system.

## Manual 10-Minute Playtest Checklist

- Player understands that `Open Cargo` spends truck cargo and places an egg.
- Player can complete the coop without the board feeling blocked.
- Merge target color communicates move, merge, swap, reject, and original cell.
- Chicken coop flying into the village is visible enough.
- Empty lot changing into a coop is memorable enough.
- Player can explain what changed in the village after closing the game.

## Current Risk

The MVP loop is mechanically complete, but the village response is still too quiet. Text plus icon swap proves state change, not emotional payoff.

## Next Visual Feedback Candidates

- Add one animated chicken near the coop.
- Add a short village line after coop completion.
- Add a simple build sound when the coop lands.
- Add a morning ambience placeholder after the coop exists.

Do not add a second merge chain until this first village response feels satisfying.

# Code Adventure Display

Code Adventure Display
建議使用 Firefox

## State & Event

State & Event

## State

c 表示類別

- `Role`     id, x, y, level, maxLife, life, energy, exp, money, equip, bag, rest
- `Monster`  id, x, y, c, maxLife, life
- `Resource` id, x, y, c
- `Building` id, x, y, c, level, maxExp, exp
- `Storage`  iron, wood, food
- `Quest`    target

## Event

### Player

- `Move`     rId, rState
- `Atk`      rId, rState, mId, mState
- `Collect`  rId, rState, resId, storageState
- `Build`    rId, rState, bId, bState
- `Sleep`    rId, rState
- `Upgrade`  rId, rState
- `Carry`    rId, rState, storageState
- `Trade`    rId, rState, storageState
- `Hello`    rId, rState
- `Forbid`   rId, rState

### System

- `Monster Gen`  mId, mState
- `Resource Gen` resId, rState
- `Quest Update` target
- `Money`        rId, rState
- `Resource`     storageState


# 資源

- [遊戲圖像來源](https://pixabay.com)
- [遊戲音樂來源]()
# Code Adventure Display

Code Adventure Display

## State & Event

State & Event

## State

- Role: Id, Level, Life, Energy, Exp, Money, Equip, Point, Bag, Delay
- Monster: Id, Class, Life, Point
- Resource: Id, Class, Point
- Building: Id, Class, Point
- Storage: Iron, Wood, Food
- Quest: Target

## Event

- Move: rId, rState
- Atk: rId, mId, rState, mState
- Collect: rId, resId, rState, storageState
- Build: rId, bId, rState, bState
- Sleep: rId, rState
- Upgrade: rId, rState
- Carry: rId, rState, storageState
- Trade: rId, rState, storageState
- 
- Invalid: rId

- Quest: questState
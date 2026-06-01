# React Key Rendering Review

Use this reference when reviewing code that renders lists, maps data to JSX, resets child state, preserves child state, or tries to improve rendering efficiency with `key`.

Primary references:

- React docs: Rendering Lists — https://react.dev/learn/rendering-lists
- React docs: Preserving and Resetting State — https://react.dev/learn/preserving-and-resetting-state

## Review Intent

`key` is React's identity hint for children under the same parent. Review `key` usage as an identity and correctness concern first, and as a rendering efficiency concern second.

A good review explains what React will be able to reuse, what it will remount, and whether that behavior matches the domain identity of the UI.

## Required Checks

1. Dynamic sibling lists must have stable, unique keys.

   - Prefer IDs that already exist in the data.
   - For locally created persisted items, generate the ID when creating the item, not during render.
   - Keys only need to be unique among siblings, not globally.

2. Do not use unstable keys for dynamic lists.

   - Avoid `key={Math.random()}`, `key={Date.now()}`, or keys derived from values that change every render.
   - Avoid array index keys when items can be inserted, deleted, sorted, filtered, or reordered.
   - Index keys are acceptable only for static lists whose order and membership cannot change.

3. Duplicated sibling keys are a correctness bug.

   - React cannot reliably match children when two siblings claim the same identity.
   - In dynamic updates, duplicate keys can make one previous child untracked while another child with the same key is reused, producing confusing UI such as stale rows, unexpected disappearances, or visually duplicated items.
   - If the code uses a property named like `uniqueKey`, verify it is actually unique for siblings in the rendered list.

4. Fragments in lists need explicit keys.

   - Short fragments (`<>...</>`) cannot receive keys.
   - If each item renders multiple sibling nodes, use `<Fragment key={item.id}>...</Fragment>` or a real wrapper element when the wrapper is semantically useful.
   - A keyed fragment can give React a child identity, but it does not create a DOM parent. If the UI relies on a DOM boundary for layout, styling, or containment, use a real element.

5. Use `key` to intentionally reset state instead of effect-based clearing.
   - When a child subtree represents a different conceptual entity at the same JSX position, pass a different key, such as `<Chat key={recipient.id} recipient={recipient} />`.
   - This remounts the subtree, recreates DOM nodes, and clears local state. Use it when that reset is desired.
   - Do not use a changing key to paper over state bugs or force refreshes; it discards state and work.

## Rendering Efficiency Guidance

Stable keys let React match the same item across renders even when items move, are inserted, or are deleted. This preserves component state and lets React update the existing DOM/component instance instead of recreating unrelated rows.

Unstable keys defeat matching. If every render produces new keys, React treats the children as new identities, recreates components and DOM, and loses local state such as input text or focus. This is both slower and behaviorally risky.

Changing a key is the right tool for a deliberate remount. It can simplify code by replacing cleanup effects or manual reset effects, but it is not a generic optimization. Prefer preserving keys for stable entities and changing keys only when the domain identity changes.

## Review Wording

For required changes:

```md
**[U18] Use stable keys for dynamic list identity**

- Current: `key={item.name}`
- Suggested: `key={item.id}`
- Why: React uses `key` to match siblings across insert/delete/reorder updates. `name` is not unique here, so one row can be reused for the wrong item and another can be remounted.
```

For intentional reset suggestions:

```md
**[U10/U18] Reset child state with a domain key**

- Current: `useEffect(() => setDraft(''), [recipient.id])`
- Suggested: `<Chat key={recipient.id} recipient={recipient} />`
- Why: The chat draft belongs to a recipient-specific subtree. A recipient key tells React to remount that subtree when the identity changes.
```

For non-blocking efficiency notes:

```md
Consider replacing `key={index}` with a stable item ID if this list can be filtered or reordered later. Stable keys let React preserve row identity and avoid remounting unrelated items.
```

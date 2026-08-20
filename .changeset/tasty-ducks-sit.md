---
'react-simplikit': patch
---

The returned handler was typed as `ChangeEventHandler<HTMLInputElement>`, so passing it to a `<textarea>` raised a type error even though the runtime behavior was identical. The handler is now typed as `ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>`, so it can be attached to both `<input>` and `<textarea>` elements.

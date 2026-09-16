Development project assets.

For each development, create a subfolder named after the slug
(lowercased Short Label, non-alphanumeric replaced with hyphens):

  assets/developments/1306-clifton-ln/
    hero.jpg            ← will be picked up if file is named "rendering.jpg" (see below)
    rendering.jpg       ← shown as hero image at top of pipeline card
    plans.pdf           ← "Building Plans" download button on pipeline card
    design-board.pdf    ← "Design Board" download button on pipeline card

Visibility is flag-driven via the form:
  - Has Rendering?      → Yes  exposes the hero
  - Has Plans?          → Yes  exposes the Building Plans button
  - Has Design Board?   → Yes  exposes the Design Board button

After dropping files, commit + push so GitHub Pages serves them.

# Pocket Weed Almanac

A mobile-first web app for identifying and learning about 20 common backyard weeds found in Connecticut. Look up any plant to get identification tips, find out if it's edible or medicinal, understand what its presence tells you about your soil, and learn the best methods to control it.

---

## Features

**Browse & Search**
- Scrollable grid of 20 weed species with thumbnail photos
- Real-time search bar — filters the list instantly as you type
- "No results" message when no weeds match your search

**Plant Detail View**
- Full-screen modal sheet with a 5-photo carousel per species:
  - Whole plant, flower close-up, leaf close-up, habitat shot, and botanical illustration
- Swipe left/right through carousel photos with dot-indicator progress tracking
- Quick-reference chips showing bloom time, primary habitat, and invasive status

**Rich Plant Information**
- Scientific name and common name
- Bloom time range
- Primary habitat
- Identification tips — 4–5 distinguishing features in a bulleted list
- Soil indicator — what the plant's presence reveals about soil conditions
- Uses — culinary, medicinal, ecological value, and any contraindications
- Control — removal techniques and long-term management strategies
- Invasive species warning box for the 4 CT-listed invasive species

**Accessibility & Navigation**
- Keyboard support: open cards with Enter or Space
- Swipe down from the top of the modal to dismiss
- Browser back/forward button support for modal open/close states
- Semantic HTML with ARIA roles and labels

**Performance**
- Lazy image loading (except the first carousel slide)
- Passive touch event listeners
- No build step — runs directly as static HTML/CSS/JS

---

## Plant List

| Common Name | Scientific Name | Invasive |
|---|---|---|
| Dandelion | *Taraxacum officinale* | |
| Common Plantain | *Plantago major* | |
| Crabgrass | *Digitaria sanguinalis* | |
| Chickweed | *Stellaria media* | |
| Ground Ivy | *Glechoma hederacea* | |
| Purslane | *Portulaca oleracea* | |
| Lambsquarters | *Chenopodium album* | |
| White Clover | *Trifolium repens* | |
| Common Ragweed | *Ambrosia artemisiifolia* | |
| Field Bindweed | *Convolvulus arvensis* | |
| Spotted Spurge | *Euphorbia maculata* | |
| Pokeweed | *Phytolacca americana* | |
| Queen Anne's Lace | *Daucus carota* | |
| Goldenrod | *Solidago canadensis* | |
| Bittersweet Nightshade | *Solanum dulcamara* | |
| Bull Thistle | *Cirsium vulgare* | |
| Garlic Mustard | *Alliaria petiolata* | CT Invasive |
| Japanese Knotweed | *Reynoutria japonica* | CT Invasive |
| Mugwort | *Artemisia vulgaris* | CT Invasive |
| Multiflora Rose | *Rosa multiflora* | CT Invasive |

---

## How to Use

### Opening a Plant

Scroll through the grid on the home screen and tap any card to open its detail view. Invasive species are marked with a red "Invasive" badge on their card.

### Searching

Tap the search bar at the top and type any part of a plant's name. The grid filters in real time. Clear the field to return to the full list.

### Navigating the Detail Modal

- **Carousel**: Swipe left or right (or tap the dots) to cycle through the 5 photos.
- **Scroll**: Scroll down to read all sections — Identification, Soil Indicator, Uses, and Control.
- **Close**: Tap the X button, tap the dark overlay behind the modal, swipe down from the top of the content, or press the browser Back button.

### Invasive Species

Plants marked as CT invasive display a prominent warning section with focused management advice. These four species — Garlic Mustard, Japanese Knotweed, Mugwort, and Multiflora Rose — require more aggressive control to prevent spread.

---

## Project Structure

```
/
├── index.html       # App shell and markup
├── app.js           # All UI logic and interactions
├── data.js          # Weed data (names, descriptions, uses, etc.)
├── styles.css       # All styles
└── photos/
    ├── dandelion/
    │   ├── 1.jpg    # Whole plant
    │   ├── 2.jpg    # Flower
    │   ├── 3.jpg    # Leaf
    │   ├── 4.jpg    # Habitat
    │   └── 5.jpg    # Illustration
    └── [one folder per weed]
```

## Setup

No build step required. Serve the project root from any static file server:

```bash
# Python
python3 -m http.server 8080

# Node (npx)
npx serve .
```

Then open `http://localhost:8080` in a browser.

To add a new weed, add an entry to the `WEEDS` array in `data.js` and create a matching `photos/{slug}/` folder with images `1.jpg` through `5.jpg`.

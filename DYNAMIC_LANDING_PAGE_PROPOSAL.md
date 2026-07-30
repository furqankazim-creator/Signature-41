# Dynamic Landing Page Proposal

Currently, the landing page is a static React component (`src/pages/Landing.tsx`). It has hardcoded arrays for `MASTER_PLAN_BLOCKS` (Premium Block, Overseas Block, etc.) and `PLOT_TABS` (the pricing/sizes section). The goal of this task is to decouple this data from the frontend code so that it can be managed dynamically by administrators directly from the CRM interface.

## 1. Questions to Consider

1. **Content Scope:** Do you want *only* the Master Plan blocks and Plot tabs to be dynamic, or do you also want to manage other landing page text (like the Hero section, Amenities, and Payment Plan) from the admin panel?
2. **Block to Plot Linkage:** Should the landing page automatically calculate available plot sizes by scanning the actual plots in the database, or should the admin manually type in the text for "Available Sizes" in the CRM settings? *(Manual text is usually easier for marketing pages, giving you full control over the messaging).*

---

## 2. Proposed Changes

### Phase 1: Backend Database & Models

We need a dedicated place in MongoDB to store the website's public marketing content. Since there will only ever be one active configuration for the landing page, we will use a singleton document pattern.

#### `server/src/models/WebsiteContent.js`
Create a new Mongoose Schema to store the content structure exactly as it's needed by the frontend:
```javascript
const websiteContentSchema = new mongoose.Schema({
  masterPlanBlocks: [{
    n: String,           // e.g., "01"
    title: String,       // e.g., "Premium Block — Boulevard Front"
    desc: String         // e.g., "Main-approach frontage..."
  }],
  plotTabs: [{
    value: String,       // e.g., "residential"
    label: String,       // e.g., "Residential Plots"
    sizes: [{
      code: String,      // e.g., "A"
      size: String,      // e.g., "200 sq yd"
      categories: [String] // e.g., ["Premium", "Overseas"]
    }]
  }]
}, { timestamps: true });
```

### Phase 2: Backend API Routes

We need two endpoints: one for the public landing page (read-only, no auth required), and one for the Admin CRM (read/write, auth required).

#### `server/src/routes/public.routes.js`
- **GET** `/api/public/website-content`
  - Fetches the single `WebsiteContent` document. If it doesn't exist, it will return a default JSON structure (the current hardcoded data) so the website never breaks.

#### `server/src/routes/settings.routes.js`
- **PUT** `/api/settings/website-content`
  - Protected by the existing `adminAuth` middleware.
  - Accepts the modified JSON payload from the CRM and saves the latest configuration.

### Phase 3: Admin CRM Interface

The administrator needs a user-friendly UI to edit this JSON structure without needing to write code.

#### `src/store/dataStore.ts`
- Add state variables: `websiteContent` (holds the current config) and `isContentLoading`.
- Add actions: `fetchWebsiteContent()` and `updateWebsiteContent(newContent)`.

#### `src/pages/crm/WebsiteSettings.tsx`
- Create a new protected route inside the CRM.
- **UI Layout:**
  - A tabbed interface separating "Master Plan Blocks" and "Plot Sizes & Categories".
  - **Master Plan Tab:** A list of cards showing the current blocks. Admins can click "Edit" on a card to open a modal, modify the Title and Description, or add a new block entirely.
  - **Plot Sizes Tab:** A complex nested form allowing admins to add/remove tabs (e.g., "Residential", "Commercial") and add specific plot sizes and category tags within those tabs.
  - A global "Save Changes" button that fires the `PUT` API request.

### Phase 4: Public Landing Page Integration

Finally, we connect the landing page to the live data stream.

#### `src/pages/Landing.tsx`
- **State Integration:** Use `useEffect` and `useState` to fetch data from `/api/public/website-content` on mount.
- **Fallback State:** While loading, or if the API fails, the component will fall back to a set of default static blocks (the ones currently hardcoded) to ensure the landing page is always visible and fast.
- **Dynamic Rendering:** Replace the static `MASTER_PLAN_BLOCKS` and `PLOT_TABS` constants with the dynamically fetched state variables.

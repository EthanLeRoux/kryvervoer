# Issue Backlog

This backlog captures requested product and engineering issues as individual, actionable tickets.

## 1) Gate "Find a driver" CTA by authentication
- **Title:** Homepage "Find a driver" button should route authenticated users to `/findadriver`, otherwise to `/login`
- **Type:** Bug / Auth flow
- **Description:** The homepage CTA currently does not enforce auth-aware routing behavior.
- **Expected behavior:**
  - Logged-in users clicking **Find a driver** are sent to `/findadriver`.
  - Logged-out users clicking **Find a driver** are sent to `/login`.
- **Acceptance criteria:**
  - CTA checks current auth session state before routing.
  - Behavior is consistent on desktop and mobile.

## 2) Rename nav "LoginSignup" label
- **Title:** Update nav label from "LoginSignup" to "Login"
- **Type:** UI copy
- **Description:** Navigation text should use a cleaner single-word login label.
- **Acceptance criteria:**
  - Nav item text reads **Login**.
  - No layout regressions in nav at common breakpoints.

## 3) Add SEO metadata to homepage
- **Title:** Implement homepage SEO metadata
- **Type:** SEO / Enhancement
- **Description:** Homepage lacks proper discoverability metadata.
- **Scope suggestions:**
  - `<title>` and `<meta name="description">`
  - Canonical URL
  - Open Graph + Twitter card tags
  - Structured data (optional stretch)
- **Acceptance criteria:**
  - Metadata exists and is environment-aware where needed.
  - Social preview tags render correctly in validators.

## 4) Remove "Chats" from nav bar
- **Title:** Remove Chats link from primary navigation
- **Type:** UI cleanup
- **Acceptance criteria:**
  - Chats nav entry no longer appears.
  - Remaining nav links retain spacing/alignment.

## 5) Fix production map marker rendering
- **Title:** Map markers display broken image icon in production
- **Type:** Bug / Maps
- **Description:** Marker assets do not resolve correctly in production, resulting in placeholder image icons.
- **Acceptance criteria:**
  - Markers render correctly in production deployment.
  - Asset path/loading strategy works across environments.

## 6) Keep post-login modal open until user closes it
- **Title:** Post-login modal should persist until explicit close
- **Type:** Bug / UX
- **Description:** After login, modal flashes and disappears immediately.
- **Acceptance criteria:**
  - Modal remains visible after successful login.
  - Modal closes only via explicit user action (e.g., close button).

## 7) Stack map above driver list/details on mobile
- **Title:** Mobile layout should place map above driver list/details
- **Type:** Responsive UI
- **Description:** Current layout places map and list side-by-side on mobile.
- **Acceptance criteria:**
  - On mobile breakpoints, map appears first, list/details below.
  - Desktop/tablet behavior remains intentional and usable.

## 8) Repair non-working navigation and filters
- **Title:** Navigation and filtering controls are non-functional; reset must work
- **Type:** Bug / Core UX
- **Description:** Navigation does not work reliably, filters do not apply, and reset behavior is broken.
- **Acceptance criteria:**
  - Navigation interactions work end-to-end.
  - Filter controls apply criteria correctly.
  - Reset restores default state for filter + results.

## 9) Show logout button when authenticated
- **Title:** Add logout nav link for logged-in users
- **Type:** Auth UI
- **Description:** Logged-in users should see a logout option styled consistently with existing nav links.
- **Acceptance criteria:**
  - Logout appears only when authenticated.
  - Styling matches other nav bar links.
  - Action terminates session and updates nav state.

## 10) Geolocated search defaults on `/findadriver`
- **Title:** Default `/findadriver` to user location and 10km driver radius
- **Type:** Feature / Location
- **Description:** Find-a-driver page should initialize around the user’s location.
- **Acceptance criteria:**
  - On page open, app requests/uses user location (with permission handling).
  - Drivers shown are initially constrained to a 10km radius.
  - Map initial center is the user location.
  - Fallback UX exists when location permission is denied/unavailable.

## 11) Restyle profile page for wider, more informative layout
- **Title:** Expand profile page width usage and surface key profile data
- **Type:** UI/UX enhancement
- **Description:** Profile page should better use horizontal space and expose relevant account information.
- **Acceptance criteria:**
  - Profile layout uses available width more effectively.
  - Relevant user information is visible and organized.
  - Responsive behavior remains accessible.

## 12) Define and implement dedicated driver profile experience
- **Title:** Drivers should have a dedicated driver profile
- **Type:** Feature / Product
- **Description:** Driver users need a profile experience distinct from rider/general user profiles.
- **Acceptance criteria:**
  - Driver profile requirements are documented.
  - Driver-specific fields and presentation are supported.
  - Role-based visibility/edit rules are enforced.

## 13) Add account management: change email and change password
- **Title:** Implement edit-profile account credential updates
- **Type:** Feature / Account management
- **Description:** Users should be able to change email and password via profile settings.
- **Acceptance criteria:**
  - Email change flow with verification/re-auth as required.
  - Password change flow with security validation.
  - Clear success/error feedback.

## 14) Ensure account deletion removes all relevant user data
- **Title:** Harden account deletion to remove all associated user information
- **Type:** Security / Data lifecycle
- **Description:** Account deletion must be complete and compliant for all related user records.
- **Acceptance criteria:**
  - All relevant user-linked data is deleted or anonymized per policy.
  - Orphaned references are not left behind.
  - Deletion behavior is documented and testable.

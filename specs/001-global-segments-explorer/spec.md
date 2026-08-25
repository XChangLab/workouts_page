# Feature Specification: Global Verified Strava Segments Explorer

**Feature Branch**: `001-global-segments-explorer`

**Created**: 2026-08-25

**Status**: Draft

**Input**: User description: "build a web application that can help me review all of the verified strava segments in the world. The segments originally from strava that should be organized by country and show distance, elevation gain and grade with the map."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse Segments by Country (Priority: P1)

A cyclist or runner wants to discover verified Strava segments in a specific country.
They open the application, select or search for a country, and are presented with a list of
all verified segments in that country, each showing the segment name, distance, elevation
gain, and average grade at a glance.

**Why this priority**: Country-based browsing is the core organisational structure of the
entire application. Without it, no other feature has context. It delivers standalone value
as a reference directory.

**Independent Test**: Can be fully tested by opening the app, selecting any country, and
confirming a list of segments with name, distance, elevation gain, and grade is displayed —
no map interaction required.

**Acceptance Scenarios**:

1. **Given** the app is open, **When** a user selects a country from the country list,
   **Then** all verified segments for that country are displayed with name, distance,
   elevation gain, and average grade visible in the list.

2. **Given** a country is selected, **When** no verified segments exist for that country,
   **Then** the app displays a clear "No verified segments found for this country" message.

3. **Given** the app is open, **When** a user searches for a country by name,
   **Then** matching countries appear as suggestions and selecting one navigates to
   that country's segment list.

---

### User Story 2 - View Segment Route on Map (Priority: P2)

A user has found a segment they are interested in and wants to see exactly where it runs
on a map, along with full detail (distance, elevation gain, grade, and segment name).

**Why this priority**: The map is the primary differentiator from a plain data table. It
lets users visually understand the geography, difficulty, and location of a segment.

**Independent Test**: Can be fully tested by selecting any segment from a country list,
confirming the segment route renders on an interactive map, and that the stats panel
alongside the map shows all required data fields.

**Acceptance Scenarios**:

1. **Given** a country segment list is displayed, **When** a user selects a segment,
   **Then** an interactive map view renders showing the segment's route as a highlighted
   path, with distance, elevation gain, and average grade displayed alongside.

2. **Given** a segment map view is open, **When** the user zooms or pans the map,
   **Then** the segment route remains correctly overlaid on the map tiles.

3. **Given** a segment map view is open, **When** the user returns to the country list,
   **Then** the previously selected country and scroll position are restored.

---

### User Story 3 - Filter and Sort Segments Within a Country (Priority: P3)

A user browsing a country with many segments wants to narrow results by distance,
grade, or elevation gain to find segments matching their ability or interest.

**Why this priority**: Countries with large segment counts (e.g., France, USA) would
otherwise be unwieldy. Filtering makes the list actionable for users with specific goals.

**Independent Test**: Can be fully tested by selecting a country with multiple segments,
applying a distance filter or sort, and confirming the displayed list updates accordingly.

**Acceptance Scenarios**:

1. **Given** a country segment list is displayed, **When** a user applies a minimum or
   maximum distance filter, **Then** only segments within that range are shown.

2. **Given** a country segment list is displayed, **When** a user sorts by average grade
   descending, **Then** the steepest segments appear at the top of the list.

3. **Given** filters are applied, **When** a user clears all filters,
   **Then** the full unfiltered segment list for the country is restored.

---

### Edge Cases

- What happens when a country has hundreds of segments — does the list paginate or
  support infinite scroll without degrading performance?
- How does the system handle segments with incomplete data (e.g., missing elevation or
  grade values)?
- What is displayed when the segment route data (map coordinates) is unavailable?
- How does the map render on small mobile screens or slow connections?
- What happens if the underlying segment data source is temporarily unavailable?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a browsable list of all countries that have at least
  one verified Strava segment.
- **FR-002**: System MUST display all verified Strava segments for a selected country,
  each showing: segment name, distance (km/mi), elevation gain (m/ft), and average grade (%).
- **FR-003**: System MUST render an interactive map view for each segment that overlays
  the segment's route path on a base map.
- **FR-004**: System MUST allow users to search or filter the country list by country name.
- **FR-005**: System MUST allow users to filter segments within a country by distance range,
  elevation gain range, and average grade range.
- **FR-006**: System MUST allow users to sort the segment list by distance, elevation gain,
  or average grade (ascending and descending).
- **FR-007**: System MUST display a stat summary panel (distance, elevation gain, grade)
  alongside the map view so users do not need to navigate away to see key data.
- **FR-008**: System MUST handle missing or incomplete segment data gracefully, displaying
  a clear placeholder rather than a broken layout.
- **FR-009**: The `segments.json` file MUST store only the Strava segment URL per entry
  (e.g. `https://www.strava.com/segments/229781`). Segment details (name, distance,
  elevation gain, grade, and route polyline) MUST be fetched from the Strava API at
  runtime using the segment ID extracted from the stored URL. The app MUST display a
  loading state while segment details are being fetched and a clear error state if the
  API call fails.
- **FR-010**: System MUST support both metric (km, m) and imperial (mi, ft) units, with
  a user-selectable preference.

### Key Entities

- **Segment**: Unique Strava segment identifier, name, country, distance, elevation gain,
  average grade, start/end coordinates, full route polyline, verified status.
- **Country**: Name, ISO country code, count of verified segments within it.
- **Unit Preference**: User's chosen measurement system (metric/imperial), persisted for
  the session.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can navigate from the app's home view to a specific country's segment
  list in 2 interactions or fewer.
- **SC-002**: The segment map view renders the route within 2 seconds of a segment being
  selected on a standard broadband connection.
- **SC-003**: Users can view all key segment statistics (name, distance, elevation gain,
  grade) for every segment in a country list without opening any additional views.
- **SC-004**: Applying any filter or sort to a country's segment list produces updated
  results within 500 milliseconds.
- **SC-005**: The application is usable on both desktop and mobile screen sizes without
  loss of core functionality (country browse, segment detail, map view).
- **SC-006**: 90% of users can locate a specific verified segment by country in under
  60 seconds during usability testing, without assistance.

## Assumptions

- Users are cyclists, runners, or endurance athletes familiar with the concept of Strava
  segments; no in-app explanation of what a "verified segment" is will be required for v1.
- The application targets authenticated or anonymous read-only access; users do NOT need
  to log in to browse segments (assumed public read access to segment data).
- Segment details are fetched live from the Strava API; the accuracy and completeness
  of Strava's data is outside the scope of this application.
- A valid Strava API access token MUST be configured; token management (refresh cycle)
  is outside the scope of v1 — the operator provides a valid token at deploy time.
- Mobile support (responsive layout) is in scope for v1 given the outdoor/on-the-go
  nature of the target audience.
- Unit preference (metric/imperial) defaults to metric; the preference is persisted for
  the current session only (not a user account setting) in v1.
- Pagination or virtual scrolling MUST be used for country lists exceeding 50 segments
  to maintain performance (aligns with constitution Performance Requirement V).
- Offline mode and segment download/export are out of scope for v1.

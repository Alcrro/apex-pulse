# PRD — Progress

## What it does
Shows two types of progress charts: estimated 1-rep-max (1RM) over time for a selected exercise, and body weight over time. Users can also log new body weight entries from this page.

## Who uses it and when
Any authenticated user navigating to `/progres` from the bottom nav. Typical use: after a few weeks of training, check whether strength or weight is improving.

## Implemented functionality
- ✅ Exercise progress section:
  - Dropdown to select any exercise from the full exercise library
  - Area chart showing estimated 1RM over time (Recharts `AreaChart` with orange gradient)
  - Current 1RM value and delta vs. first session displayed above chart
  - Loading spinner while chart data is fetching
  - "No data" empty state if no logs exist for the selected exercise
- ✅ Body weight section:
  - Inline form (weight in kg + date picker) to log a new entry
  - Line chart showing the last 90 body weight entries (Recharts `LineChart`, orange)
  - Current weight and delta vs. first entry displayed above chart
  - Delta colored green (loss) or orange (gain)
  - Loading state and empty state (before first entry)
- ✅ Custom `ChartTooltip` for both charts showing date and value in kg

## Known limitations / missing
- No delete / edit body weight entries
- No exercise progress for bodyweight exercises (those with null weight are excluded from the 1RM calculation)
- 1RM uses a simplified Epley formula (`weight * (1 + reps/30)`), not session-average — it picks the best set per day
- No date range filter on the exercise progress chart (shows all historical logs up to 200)
- No volume (total tonnage) chart
- No session frequency chart

## Main user flow
**Exercise progress:**
1. User selects an exercise from the dropdown
2. Chart data fetches from `session_logs`
3. Area chart and summary stats appear

**Body weight:**
1. User enters weight and date, taps "Adaugă"
2. Entry saved to DB; chart updates with new point

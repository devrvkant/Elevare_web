# Fix: Roadmap ID Issue - `undefined` in Route

## 🐛 Problem

When clicking on a roadmap from the list, the URL showed:

```
localhost:5173/dashboard/roadmaps/undefined
```

This caused a 404 error because the ID was not being passed correctly.

## 🔍 Root Cause

**Mismatch between backend and frontend field names:**

### Backend (MongoDB)

- MongoDB automatically creates an `_id` field for documents
- Backend returns roadmaps with `_id` field
- Example response:

```json
{
  "success": true,
  "data": [
    {
      "_id": "674a3b2c1d2e3f4g5h6i7j8k",
      "career": "Software Engineer",
      "userId": "user_123",
      "steps": [...],
      ...
    }
  ]
}
```

### Frontend (Before Fix)

- Was using `roadmap.id` instead of `roadmap._id`
- This caused `undefined` to be passed to the navigation

## ✅ Solution

Changed `RoadmapsPage.jsx` to use the correct MongoDB field:

### Before:

```jsx
{roadmaps.map((roadmap) => (
  <div
    key={roadmap.id}  // ❌ Wrong - MongoDB uses _id
    onClick={() => navigate(`/dashboard/roadmaps/${roadmap.id}`)}  // ❌ Wrong
  >
```

### After:

```jsx
{roadmaps.map((roadmap) => (
  <div
    key={roadmap._id}  // ✅ Correct - MongoDB field name
    onClick={() => navigate(`/dashboard/roadmaps/${roadmap._id}`)}  // ✅ Correct
  >
```

## 📊 Data Flow (Fixed)

```
Backend (MongoDB)
    ↓
Returns: { _id, career, steps, ... }
    ↓
RTK Query (roadmapApi.js)
    ↓
transformResponse: (response) => response.data
    ↓
RoadmapsPage Component
    ↓
Uses: roadmap._id ✅
    ↓
Navigation: /dashboard/roadmaps/{_id} ✅
    ↓
RoadmapPage Component
    ↓
useGetRoadmapQuery(id) ✅
```

## 🧪 Testing

1. **Go to Roadmaps page**: `/dashboard/roadmaps`
2. **View your existing roadmaps**
3. **Click on any roadmap card**
4. **Verify URL shows**: `/dashboard/roadmaps/674a3b2c...` (actual MongoDB ID)
5. **Verify roadmap displays correctly**

## 🔧 Files Modified

- ✅ `client/src/pages/RoadmapsPage.jsx` - Changed `roadmap.id` to `roadmap._id`

## 📝 Related Components

All these components now correctly use MongoDB `_id`:

1. **RoadmapsPage.jsx** - Lists roadmaps, uses `_id` for navigation ✅
2. **RoadmapPage.jsx** - Displays single roadmap, receives `_id` from URL ✅
3. **CareerPredictionModal.jsx** - Navigates with `_id` after generation ✅
4. **roadmapApi.js** - All endpoints use `_id` parameter ✅

## 🎯 Why This Happened

When we initially simplified the system and removed the custom `id` field, we kept MongoDB's default `_id`. However, one place (RoadmapsPage) still referenced the old `id` field, causing the undefined error.

## ✨ Current State

- ✅ Backend uses MongoDB `_id` exclusively
- ✅ Frontend uses `_id` consistently across all components
- ✅ Navigation works correctly
- ✅ RTK Query properly fetches by `_id`
- ✅ No custom ID field needed

## 🚀 How to Verify Fix

```bash
# 1. Start backend (if not running)
cd server && npm run dev

# 2. Start frontend (if not running)
cd client && npm run dev

# 3. Open browser
# Visit: http://localhost:5173/dashboard/roadmaps

# 4. Click any roadmap card
# URL should show: /dashboard/roadmaps/674a3b2c... (actual MongoDB ID)
# Page should load correctly
```

## 📌 Key Takeaway

Always use MongoDB's `_id` field when working with MongoDB documents. Don't mix `id` and `_id` - stay consistent across your entire application.

---

**Status**: ✅ **FIXED** - Roadmaps now navigate correctly using MongoDB `_id`

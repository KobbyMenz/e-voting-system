# Performance & Optimization Analysis Report

## E-Voting System Codebase

---

## 🔴 CRITICAL ISSUES

### 1. **Excessive Data Polling - AdminDashboardContent.jsx**

**Severity:** CRITICAL  
**Location:** [AdminDashboardContent.jsx](src/component/pages/AdminDashboard/AdminDashboardContent.jsx#L73)

```javascript
const { data, setRefetch, loading } = useFetch(
  `${app_api_url}/getAllElections`,
  1000, // ❌ Fetches EVERY 1 SECOND!
);
```

**Impact:**

- Makes 60+ API calls per minute
- Causes continuous re-renders even when data hasn't changed
- Database and network overhead
- Blocks UI thread

**Solution:**

- Reduce polling interval to 30-60 seconds OR
- Implement WebSocket for real-time updates OR
- Use reactive backend events (Server-Sent Events)

---

### 2. **Inefficient Database Query in getAllElectionsRoute**

**Severity:** CRITICAL  
**Location:** [getAllElectionsRoute.js](src/backend/Routes/getAllElectionsRoute.js#L22)

```javascript
const sqlQuery = `SELECT election.*, candidate.* 
    FROM e_voting_db.election 
    LEFT JOIN e_voting_db.candidate ON election.electionId = candidate.electionId`;
```

**Impact:**

- Fetches ALL candidates for ALL elections every request
- N+1 query problem
- No pagination
- Returns massive dataset

**Solution:**

- Add pagination: `LIMIT 50 OFFSET 0`
- Use indexed queries
- Filter by date ranges if needed
- Consider separating elections and candidates into two endpoints

---

### 3. **Excessive Event Listeners in App.jsx**

**Severity:** HIGH  
**Location:** [App.jsx](src/App.jsx#L45-L70)

```javascript
useEffect(() => {
  const events = [
    "mousemove",
    "mousedown",
    "keydown",
    "touchstart",
    "scroll",
    "click",
  ];
  const resetInactivity = () => {
    /* ... */
  };

  events.forEach((ev) => window.addEventListener(ev, resetInactivity));
  // ❌ This re-attaches 6 listeners on EVERY state change

  return () => {
    events.forEach((ev) => window.removeEventListener(ev, resetInactivity));
  };
}, [INACTIVITY_TIME, logoutHandler, isLoggedIn]); // ❌ Too many dependencies
```

**Impact:**

- Memory leaks from duplicate listeners
- Performance degradation

**Solution:**

- Move to separate effect
- Use `useRef` for timer only
- Debounce event handlers

---

## 🟠 HIGH PRIORITY ISSUES

### 4. **Missing Error Handling in useFetch Hook**

**Severity:** HIGH  
**Location:** [useFetch.js](src/component/CustomHooks/useFetch.js#L1)

```javascript
catch (err) {
  if (err.name !== "AbortError") {
    console.error("Fetch error:", err.message);
    setLoading(true);  // ❌ Always sets to true, never recovers
  }
}
```

**Impact:**

- Failed requests never show to user
- Component stuck in loading state
- No retry mechanism
- Poor UX

**Solution:**

```javascript
const [error, setError] = useState(null);
catch (err) {
  if (err.name !== "AbortError") {
    setError(err.message);
    setLoading(false);
  }
}
```

---

### 5. **Database Connection Not Pooled**

**Severity:** HIGH  
**Location:** [dataBaseConnection.js](src/backend/Services/dataBaseConnection.js#L5)

```javascript
const dataBaseConnection = mysql.createConnection({
  host: process.env.VITE_DB_HOST,
  user: process.env.VITE_DB_USER,
  password: process.env.VITE_DB_PASSWORD,
  database: process.env.VITE_DB_NAME,
});
```

**Impact:**

- Single connection bottleneck
- Concurrent requests queued
- No connection reuse
- Server crashes under load

**Solution:**
Use connection pooling:

```javascript
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.VITE_DB_HOST,
  user: process.env.VITE_DB_USER,
  password: process.env.VITE_DB_PASSWORD,
  database: process.env.VITE_DB_NAME,
});
```

---

### 6. **SQL Injection Vulnerability in getAllElectionsRoute**

**Severity:** HIGH (Security)  
**Location:** [getAllElectionsRoute.js](src/backend/Routes/getAllElectionsRoute.js#L62-L70)

```javascript
const updateCases = electionsToUpdate
  .map((el) => `WHEN electionId = ${el.electionId} THEN '${el.newStatus}'`)
  .join("\n"); // ❌ String concatenation = SQL injection!
```

**Impact:**

- SQL injection attacks possible
- Data corruption/theft

**Solution:**
Use prepared statements:

```javascript
const updateCases = electionsToUpdate
  .map((el) => `WHEN electionId = ? THEN ?`)
  .join("\n");
```

---

## 🟡 MEDIUM PRIORITY ISSUES

### 7. **Unused useRef in useFetch**

**Severity:** MEDIUM  
**Location:** [useFetch.js](src/component/CustomHooks/useFetch.js#L6)

```javascript
const isFirstRender = useRef(false);
// ❌ Declared but never used properly
// Commented out logic at line 10-13
```

**Solution:** Remove or implement properly

---

### 8. **Inefficient Filtering in AdminDashboardContent**

**Severity:** MEDIUM  
**Location:** [AdminDashboardContent.jsx](src/component/pages/AdminDashboard/AdminDashboardContent.jsx#L217)

```javascript
const filteredElectionRows = useMemo(
  () =>
    election
      .filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(search.toLowerCase()),
        ),
      )
      .sort(...),  // ❌ Searches through entire objects including arrays
  [election, search],
);
```

**Impact:**

- Inefficient string conversion of complex objects
- Re-runs entire filter on every keystroke

**Solution:**

```javascript
.filter((row) =>
  row.title.toLowerCase().includes(search.toLowerCase()) ||
  row.description.toLowerCase().includes(search.toLowerCase())
)
```

---

### 9. **Missing Database Indexes**

**Severity:** MEDIUM  
**Location:** Database schema (not visible)

```sql
-- ❌ No indexes mentioned on:
-- - electionId (foreign key)
-- - candidateId (foreign key)
-- - userId, voterId (lookups)
-- - dateCreated (sorting/filtering)
-- - status (filtering)
```

**Solution:**

```sql
CREATE INDEX idx_election_id ON candidate(electionId);
CREATE INDEX idx_election_status ON election(status);
CREATE INDEX idx_election_dates ON election(startDate, endDate);
CREATE INDEX idx_candidate_election ON candidate(electionId, candidateId);
```

---

### 10. **Multiple useMemo Operations Without Value Extraction**

**Severity:** MEDIUM  
**Location:** [AdminDashboardContent.jsx](src/component/pages/AdminDashboard/AdminDashboardContent.jsx#L79-L143)

```javascript
const allElections = useMemo(() => (data !== null ? data : []), [data]); // Simple check
const candidatesByElection = useMemo(() => {
  /* grouping logic */
}, [allElections]);
const uniqueElections = useMemo(() => {
  /* filtering */
}, [allElections]);
const election = useMemo(() => {
  /* mapping */
}, [uniqueElections, candidatesByElection]);

// ❌ 4 layers of memoization for transformation chain
// Only the final result matters
```

**Solution:** Combine into single memoized selector

---

## 🟢 LOW PRIORITY / BEST PRACTICES

### 11. **Missing Response Metadata in API Routes**

**Location:** [getAllUsersRoute.js](src/backend/Routes/getAllUsersRoute.js#L10), [getAllVotersRoute.js](src/backend/Routes/getAllVotersRoute.js#L10)

```javascript
res.status(200).json({
  result: result,
});
// ❌ No count, total pages, or timestamp
```

**Solution:**

```javascript
res.status(200).json({
  result: result,
  count: result.length,
  timestamp: new Date().toISOString(),
});
```

---

### 12. **Console Logging in Production Code**

**Severity:** LOW (but should remove)
**Locations:**

- [dataBaseConnection.js#L11](src/backend/Services/dataBaseConnection.js#L11): `console.log("Database connected successfully")`
- [getAllElectionsRoute.js#L31](src/backend/Routes/getAllElectionsRoute.js#L31): Multiple `console.log` statements

**Solution:** Wrap in `process.env.NODE_ENV === 'development'`

---

## 📊 PERFORMANCE OPTIMIZATION PRIORITY MATRIX

| Issue                   | Severity | Effort | Impact    | Priority |
| ----------------------- | -------- | ------ | --------- | -------- |
| Reduce polling interval | CRITICAL | LOW    | VERY HIGH | **1**    |
| Add pagination          | CRITICAL | MEDIUM | VERY HIGH | **2**    |
| Connection pooling      | HIGH     | MEDIUM | HIGH      | **3**    |
| Error handling fix      | HIGH     | LOW    | MEDIUM    | **4**    |
| SQL injection fix       | HIGH     | LOW    | CRITICAL  | **5**    |
| Event listener cleanup  | HIGH     | LOW    | HIGH      | **6**    |
| Database indexes        | MEDIUM   | LOW    | HIGH      | **7**    |
| Optimize filtering      | MEDIUM   | LOW    | MEDIUM    | **8**    |
| Remove console logs     | LOW      | LOW    | LOW       | **9**    |

---

## 🚀 QUICK WINS (< 1 Hour Each)

1. ✅ Change `useFetch(..., 1000)` to `useFetch(..., 60000)` (60 seconds)
2. ✅ Add `LIMIT 50` to getAllElectionsRoute query
3. ✅ Fix error handling in useFetch hook
4. ✅ Remove unused `isFirstRender` ref
5. ✅ Add `STOP` condition in event listener effect
6. ✅ Wrap console.logs in dev check
7. ✅ Add basic database indexes

---

## 📋 MEDIUM TERM IMPROVEMENTS (1-2 Hours Each)

1. 🔄 Implement connection pooling
2. 🔄 Fix SQL injection vulnerabilities
3. 🔄 Optimize search filtering
4. 🔄 Add response caching headers
5. 🔄 Implement pagination UI

---

## 🏗️ LONG TERM ARCHITECTURE (Major Refactor)

1. **Real-time Updates:** Replace polling with WebSocket or Server-Sent Events
2. **API Response Optimization:** Implement GraphQL or REST with selective fields
3. **Caching Strategy:** Add Redis for frequently accessed data
4. **Component Memoization:** Wrap expensive components with `React.memo()`
5. **Code Splitting:** Lazy load route components
6. **Image Optimization:** Next.js Image component or optimization
7. **State Management:** Consider Redux or Zustand for global state

---

## ✅ Implementation Checklist

- [ ] Reduce polling from 1s to 60s
- [ ] Add pagination to getAllElectionsRoute
- [ ] Implement connection pooling
- [ ] Fix useFetch error handling
- [ ] Fix SQL injection in batch updates
- [ ] Add database indexes
- [ ] Optimize event listeners
- [ ] Remove console logs
- [ ] Add response metadata
- [ ] Test under load with concurrent users
- [ ] Profile with lighthouse/DevTools
- [ ] Implement monitoring/logging

---

**Generated:** March 30, 2026  
**Reviewed Scope:** Full codebase structure, React components, backend routes, custom hooks

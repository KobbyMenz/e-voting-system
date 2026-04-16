# 🔐 Production-Ready Login Route with Redis Integration

This document outlines the production-ready authentication system with Redis integration, proper environment variable handling, and database transaction support.

## ✨ Key Improvements

### 1. **Redis Integration** ✅

Instead of in-memory storage that's lost on server restart, the production version uses Redis for:

- **Failed Login Attempts** — Tracks brute force attempts across server instances
- **Revoked Tokens** — Centralized token blacklist for distributed systems
- **Refresh Token Sessions** — Persistent session management across multiple servers

**Fallback:** Development mode automatically falls back to in-memory storage if Redis is unavailable.

```javascript
// Production: Uses Redis with TTL
const isRedisConnected = process.env.NODE_ENV === "production";

if (isRedisConnected) {
  // Redis stores data with automatic expiration
  await redisClient.setEx(key, ttl, value);
}
```

### 2. **Fixed Environment Variables** ✅

**Before:**

```javascript
// ❌ Unsafe: String concatenation
const secret =
  process.env.VITE_REFRESH_TOKEN_SECRET ||
  process.env.VITE_JWT_SECRET + "_refresh";
```

**After:**

```javascript
// ✅ Safe: Separate environment variable
const secret = process.env.VITE_REFRESH_TOKEN_SECRET;
```

**Required in `.env`:**

```env
VITE_JWT_SECRET=your_jwt_secret_here_min_32_characters
VITE_REFRESH_TOKEN_SECRET=your_refresh_token_secret_here_min_32_characters
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=optional_password
```

### 3. **Database Transactions** ✅

Login updates now use database transactions:

```javascript
// ✅ Atomic operation: All-or-nothing update
db.query("START TRANSACTION", (err) => {
  db.query(sqlUpdateQuery, [currentDate, user.userId], (err) => {
    if (err) {
      db.query("ROLLBACK"); // Revert on error
    } else {
      db.query("COMMIT"); // Confirm on success
    }
  });
});
```

## 🚀 Setup Instructions

### Prerequisites

```bash
npm install redis
```

### 1. Install & Start Redis

**Windows:**

```powershell
# Using WSL (Windows Subsystem for Linux)
# Or download Redis from: https://github.com/microsoftarchive/redis/releases
redis-server
```

**macOS:**

```bash
brew install redis
redis-server
```

**Linux:**

```bash
sudo apt-get install redis-server
redis-server
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Authentication
NODE_ENV=production
VITE_JWT_SECRET=your_strong_jwt_secret_min_32_chars_long_1234567890
VITE_REFRESH_TOKEN_SECRET=your_strong_refresh_secret_min_32_chars_long_1234567890

# Redis (production only)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=your_optional_redis_password

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=e_voting_db
```

### 3. Update package.json

Ensure redis is installed:

```json
{
  "dependencies": {
    "redis": "^4.6.0"
  }
}
```

### 4. Start the Server

```bash
npm start
```

## 📊 API Endpoints (Unchanged)

All endpoints work the same, but with enhanced security:

### POST `/api/login`

Authenticate user and receive tokens

- Rate limiting: 5 failed attempts = 15-minute lockout
- Response includes both access and refresh tokens

### POST `/api/refresh-token`

Refresh expired access token

- Validates refresh token against Redis
- Returns new access token

### POST `/api/logout`

Logout and revoke all tokens

- Adds tokens to Redis blacklist
- Clears httpOnly cookies

### GET `/api/verify-token`

Check if access token is valid

- Verifies token signature
- Checks Redis revocation list

## 🔒 Security Features

| Feature              | Before                       | After                    |
| -------------------- | ---------------------------- | ------------------------ |
| Distributed Sessions | ❌ In-memory (single server) | ✅ Redis (multi-server)  |
| Token Secret         | ❌ String concatenation      | ✅ Separate env variable |
| Login Updates        | ❌ No transaction            | ✅ Atomic transaction    |
| Data Persistence     | ❌ Lost on restart           | ✅ Persistent in Redis   |
| Multi-Server         | ❌ Not supported             | ✅ Fully supported       |

## 🧪 Testing

### Test Rate Limiting

```javascript
// Make 5 failed login attempts
// 6th attempt should return 429 (Too Many Requests)
```

### Test Token Revocation

```javascript
// 1. Login to get tokens
// 2. Logout (revokes tokens)
// 3. Use old token → Should fail with 401
```

### Test Refresh Token

```javascript
// 1. Login
// 2. Wait for access token to expire (or modify expiry for testing)
// 3. Call /api/refresh-token
// 4. Receive new access token
```

## 📝 Redis Commands for Debugging

```bash
# Connect to Redis
redis-cli

# View all keys
KEYS *

# View login attempts
GET login_attempts:admin@example.com

# View revoked tokens
EXISTS revoked_token:eyJhbGc...

# Delete all data (⚠️ Careful!)
FLUSHALL

# Monitor in real-time
MONITOR
```

## ⚡ Performance Benefits

1. **Horizontal Scaling** — Works across multiple servers
2. **Automatic Expiration** — Redis TTL prevents memory leaks
3. **Reduced DB Calls** — Token checks don't hit database
4. **Distributed Lockout** — Rate limiting works across instances

## 🔧 Troubleshooting

### Redis Connection Failed

```javascript
// Falls back to in-memory automatically
// Check Redis is running:
redis-cli ping
// Should return: PONG
```

### Token Not Refreshing

1. Verify `VITE_REFRESH_TOKEN_SECRET` is set
2. Check token hasn't expired (7-day limit)
3. Confirm refresh token session exists in Redis

### Rate Limiting Not Working

1. Check Redis connection
2. Verify failed login attempts are being stored
3. Monitor with: `redis-cli MONITOR`

## 📚 File Structure

```
src/backend/Routes/
├── loginRoute.REFRESH.js (updated)
└── ... other routes
```

## 🚀 Next Steps

1. **Optional: Use Redis Sentinel** for high availability
2. **Optional: Use Redis Cluster** for scaling to multiple nodes
3. **Monitor:** Set up Redis monitoring/alerts
4. **Backup:** Configure Redis persistence (RDB/AOF)

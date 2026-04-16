# 🚀 Quick Start: Production Login Route

## ✅ All Fixed Issues

- ✅ **Redis Integration** — Session data persists across server restarts and multiple instances
- ✅ **Proper Environment Variables** — Removed unsafe string concatenation for secrets
- ✅ **Database Transactions** — Login updates are now atomic operations
- ✅ **Async/Await** — All session operations are properly asynchronous

## 📦 Installation

### 1. Install Redis Package

```bash
npm install redis
```

### 2. Create `.env` File

Copy from `.env.example` and fill in your values:

```bash
cp .env.example .env
```

### 3. Start Redis Server

**Windows (using WSL or Docker):**

```bash
docker run -d -p 6379:6379 redis:latest
```

**macOS:**

```bash
redis-server
```

**Linux:**

```bash
sudo systemctl start redis-server
```

### 4. Verify Redis Connection

```bash
redis-cli ping
# Should return: PONG
```

## 🔍 What Changed?

### Before

```javascript
// ❌ In-memory only
const failedLoginAttempts = new Map();

// ❌ Unsafe secret handling
const secret = process.env.JWT_SECRET + "_refresh";

// ❌ Non-atomic operation
db.query(sqlUpdateQuery, ...);
```

### After

```javascript
// ✅ Redis with fallback
const isRedisConnected = process.env.NODE_ENV === "production";
if (isRedisConnected) {
  await redisClient.setEx(key, ttl, value);
}

// ✅ Safe environment variable
const secret = process.env.VITE_REFRESH_TOKEN_SECRET;

// ✅ Atomic transaction
db.query("START TRANSACTION", ...);
```

## ⚙️ Environment Variables

**Required in `.env`:**

```env
# Node environment
NODE_ENV=production

# JWT Secrets (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
VITE_JWT_SECRET=your_random_32_char_hex_string_here
VITE_REFRESH_TOKEN_SECRET=your_another_32_char_hex_string_here

# Redis Configuration
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=optional_password_if_auth_enabled
```

## 🧪 Test the Setup

### Test 1: Login Success

```bash
POST /api/login
{
  "username": "admin@example.com",
  "password": "password123",
  "role": "admin"
}
# Response: 200 OK with tokens
```

### Test 2: Rate Limiting (5 failed = locked)

```bash
# Send wrong password 5 times
# 6th attempt should return: 429 Too Many Requests
```

### Test 3: Token Refresh

```bash
POST /api/refresh-token
# Response: 200 OK with new access token
```

### Test 4: Token Revocation (Logout)

```bash
POST /api/logout
# Old tokens should now be invalid
```

## 📊 Redis Data Structure

```
login_attempts:{identifier}
  → { count, lastAttemptTime, lockedAt }

revoked_token:{token}
  → "revoked"

refresh_session:{refreshToken}
  → { userId, createdAt }
```

## 🔧 Debugging

### Check if Redis is connected

```javascript
// In console, check for:
console.log(redisClient.isOpen); // true = connected
```

### View Redis data

```bash
redis-cli
> KEYS *
> GET login_attempts:admin@example.com
> TTL key_name
```

### Monitor Redis in real-time

```bash
redis-cli MONITOR
```

## ⚠️ Important Notes

1. **Production Only** — Redis is only used when `NODE_ENV=production`
2. **Development Falls Back** — In-memory storage is used in development
3. **Set Strong Secrets** — Use random 32-character strings for JWT secrets
4. **Monitor Redis Memory** — Set up memory limits in redis.conf

## 📚 Full Documentation

See `PRODUCTION_AUTH_SETUP.md` for detailed information.

## 🆘 Common Issues

| Issue                            | Solution                                  |
| -------------------------------- | ----------------------------------------- |
| Redis connection failed          | Start Redis server and check credentials  |
| Tokens not persisting            | Verify Redis is running: `redis-cli ping` |
| Rate limiting not working        | Check `NODE_ENV=production` is set        |
| Environment variables not loaded | Restart server after updating `.env`      |

## ✨ Features Enabled

- ✅ Multi-server session management
- ✅ Distributed rate limiting
- ✅ Persistent token revocation
- ✅ Atomic database transactions
- ✅ Proper secret management
- ✅ Automatic data expiration

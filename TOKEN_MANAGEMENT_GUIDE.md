# 🔐 Token Management Guide
## Complete Token Flow & Configuration

**Created**: 2025-01-30  
**Backend**: SA-Token with JWT  
**Frontend**: Expo React Native

---

## 📋 Table of Contents
1. [Token Storage (Where)](#token-storage)
2. [Token Transmission (How)](#token-transmission)
3. [Backend SA-Token Configuration](#backend-configuration)
4. [Complete Flow](#complete-flow)
5. [Troubleshooting](#troubleshooting)

---

## 🗄️ Token Storage (Where)

### Frontend Storage Location

**File**: `src/features/AuthModule/stores/authStore.ts`

**Storage Keys** (defined in `LoginMainPage/constants.ts`):
```typescript
export const SECURE_KEYS = {
  ACCESS_TOKEN: 'access_token',      // 访问令牌
  REFRESH_TOKEN: 'refresh_token',     // 刷新令牌
  USER_CREDENTIALS: 'user_credentials', // 用户信息
}
```

**Storage Method**: Dual-layer secure storage
```typescript
// Priority 1: Expo SecureStore (encrypted hardware storage)
await SecureStore.setItemAsync('access_token', token);

// Fallback: AsyncStorage with 'secure_' prefix
await AsyncStorage.setItem('secure_access_token', token);
```

**When Stored**:
1. **Login Success** (`authStore.ts` lines 189-191)
   ```typescript
   await secureStorage.setItem(SECURE_KEYS.ACCESS_TOKEN, accessToken);
   await secureStorage.setItem(SECURE_KEYS.REFRESH_TOKEN, refreshToken);
   await secureStorage.setItem(SECURE_KEYS.USER_CREDENTIALS, JSON.stringify(userInfo));
   ```

2. **Token Refresh** (`authStore.ts` lines 304-307)
   ```typescript
   await secureStorage.setItem(SECURE_KEYS.ACCESS_TOKEN, newAccessToken);
   await secureStorage.setItem(SECURE_KEYS.REFRESH_TOKEN, newRefreshToken);
   ```

**When Cleared**:
1. **Logout** (`authStore.ts` lines 241-243)
2. **Token Refresh Failed** (`authStore.ts` line 343)

---

## 📤 Token Transmission (How)

### Current Implementation

**File**: `services/api/client.ts`

### Method 1: Authorization Header (Primary) ✅

**Format**: OAuth 2.0 Standard Bearer Token
```typescript
headers: {
  'Authorization': 'Bearer <accessToken>',
  'clientid': 'app',  // Required by backend
  'Content-Type': 'application/json'
}
```

**Implementation** (lines 185-187, 390-399):
```typescript
// Set token
setAuthToken(token: string): void {
  this.defaultHeaders['Authorization'] = `Bearer ${token}`;
}

// Auto-inject in requests
const token = this.getAuthToken();
if (token) {
  this.setAuthToken(token);
  console.log(`🔑 Token格式: Authorization: Bearer ${token.substring(0, 20)}...`);
}
```

### Method 2: Request Parameter (Supported but not used) ⚠️

SA-Token supports reading token from URL parameters:
```
GET /api/v2/user/profile/2000?Authorization=<token>
```

**Backend Config** (`common-satoken.yml` line 7):
```yaml
sa-token:
  is-read-body: true  # Allow reading from request parameters
```

**Status**: ⚠️ Not implemented in frontend (not needed, headers are sufficient)

### Method 3: Custom Header (Not recommended) ❌

Some systems use custom headers like:
```
headers: {
  'satoken': '<token>',
  'token': '<token>',
  'X-Token': '<token>'
}
```

**Status**: ❌ Not used (backend expects `Authorization` header)

---

## ⚙️ Backend SA-Token Configuration

### Backend Files

**1. Common Config** (`ruoyi-common-satoken/src/main/resources/common-satoken.yml`):
```yaml
sa-token:
  dynamic-active-timeout: true
  is-read-body: true         # ✅ Allow reading from request params
  is-read-header: true       # ✅ Allow reading from headers
  is-read-cookie: false      # ❌ Disable cookie (security)
  token-prefix: "Bearer"     # 🔑 MUST match: "Bearer <token>"
```

**2. Nacos Config** (`application-common.yml`):
```yaml
sa-token:
  token-name: Authorization  # 🔑 Header name (also supports reading from body/param)
  check-same-token: true
  is-concurrent: true
  is-share: false
  jwt-secret-key: abcdefghijklmnopqrstuvwxyz
```

### Critical Backend Requirements

**✅ MUST INCLUDE**:
1. **Authorization Header**: `Authorization: Bearer <token>`
2. **ClientId Header**: `clientid: app` (MUST match login clientType!)

**Backend Validation** (`ruoyi-gateway/src/main/java/org/dromara/gateway/filter/AuthFilter.java` lines 46-50):
```java
// Check if clientid in header/param matches clientid in token
String headerCid = request.getHeaders().getFirst(LoginHelper.CLIENT_KEY);  // "clientid"
String paramCid = request.getQueryParams().getFirst(LoginHelper.CLIENT_KEY);
String clientId = StpUtil.getExtra(LoginHelper.CLIENT_KEY).toString();    // From token

if (!StringUtils.equalsAny(clientId, headerCid, paramCid)) {
    // ❌ 401 Error: "客户端ID与Token不匹配"
}
```

**`LoginHelper.CLIENT_KEY`** = `"clientid"` (defined in `LoginHelper.java` line 40)

---

## 🔄 Complete Flow

### 1. Login Flow

```
┌─────────────┐     POST /xypai-auth/api/v1/auth/login     ┌──────────────┐
│             │     {                                        │              │
│  App Login  │       username: "alice_dev",                │   Backend    │
│   Screen    │       password: "123456",                   │ Auth Service │
│             │       clientType: "app",                    │              │
└─────────────┘       deviceId: "device_xxx"                └──────────────┘
       │            }                                                │
       │───────────────────────────────────────────────────────────>│
       │                                                             │
       │                                                      [Login Success]
       │                                                             │
       │            Response:                                        │
       │<───────────────────────────────────────────────────────────│
       │            {                                                │
       │              code: 200,                                     │
       │              data: {                                        │
       │                accessToken: "eyJhbGc...",  ← JWT Token     │
       │                refreshToken: "eyJhbGc...",                  │
       │                tokenType: "Bearer",                         │
       │                expiresIn: 86400,                            │
       │                userInfo: { ... }                            │
       │              }                                              │
       │            }                                                │
       │                                                             │
       ▼                                                             │
  [Store in SecureStore]                                            │
  ✅ access_token                                                   │
  ✅ refresh_token                                                  │
  ✅ user_credentials                                               │
```

### 2. API Request Flow (Authenticated)

```
┌──────────────┐    GET /xypai-user/api/v2/user/profile/2000    ┌─────────────┐
│              │    Headers:                                      │             │
│  App Profile │      Authorization: Bearer eyJhbGc...           │   Gateway   │
│     Page     │      clientid: app                              │   (8080)    │
│              │      Content-Type: application/json             │             │
└──────────────┘                                                  └─────────────┘
       │                                                                 │
       │                                                                 │
       │  [API Client Auto-Injects Token]                               │
       │─────────────────────────────────────────────────────────────>  │
       │                                                                 │
       │                                                     [Gateway Validates]
       │                                                     1. Parse "Bearer <token>"
       │                                                     2. Extract clientid from token
       │                                                     3. Compare with header clientid
       │                                                     4. ✅ Match? Forward to service
       │                                                                 │
       │                                                                 ▼
       │                                                     ┌──────────────────┐
       │                                                     │  xypai-user      │
       │                                                     │  Profile Service │
       │                                                     └──────────────────┘
       │                                                                 │
       │             Response: { code: 200, data: {...} }               │
       │<────────────────────────────────────────────────────────────────│
       │                                                                 │
       ▼                                                                 │
   [Display Profile]                                                    │
```

### 3. Token Refresh Flow (401 Auto-Recovery)

```
┌──────────────┐    GET /api/v2/user/profile/2000               ┌─────────────┐
│              │    Authorization: Bearer <expired_token>        │             │
│     App      │                                                 │   Backend   │
│              │                                                 │             │
└──────────────┘                                                 └─────────────┘
       │                                                                │
       │────────────────────────────────────────────────────────────>  │
       │                                                                │
       │                  Response: 401 Unauthorized                   │
       │<───────────────────────────────────────────────────────────── │
       │                                                                │
       │  [API Client Detects 401]                                     │
       │  [Calls authStore.refreshAuthToken()]                         │
       │                                                                │
       │    POST /xypai-auth/api/v1/auth/refresh?refreshToken=xxx      │
       │─────────────────────────────────────────────────────────────> │
       │                                                                │
       │    Response: { accessToken: "new...", refreshToken: "new..." }│
       │<───────────────────────────────────────────────────────────── │
       │                                                                │
       │  [Update SecureStore]                                         │
       │  [Retry Original Request with New Token]                      │
       │                                                                │
       │    GET /api/v2/user/profile/2000 (with new token)             │
       │─────────────────────────────────────────────────────────────> │
       │                                                                │
       │    Response: 200 OK { data: {...} }                           │
       │<───────────────────────────────────────────────────────────── │
       │                                                                │
       ▼                                                                │
   ✅ Success!                                                         │
```

---

## 🧪 How to Verify Token is Working

### Method 1: Check Console Logs

Look for these logs in your app console:

**✅ Login Success**:
```
🔑 [AuthAPI] 密码登录请求
✅ [AuthAPI] 登录成功，已自动设置token
```

**✅ Token Auto-Injection**:
```
🔑 [第三层] API请求拦截 - 已自动添加token
   请求: GET /xypai-user/api/v2/user/profile/2000
   Token格式: Authorization: Bearer eyJhbGciOiJIUzI1NiI...
   ClientId: app ✅
```

**✅ Token Refresh**:
```
🔄 [第三层] 检测到401错误 - 智能处理
   处理: 🔒 需要登录，尝试刷新token
   结果: ✅ Token刷新成功，重试请求
```

### Method 2: Decode JWT Token

1. Copy `accessToken` from SecureStore or login response
2. Go to [jwt.io](https://jwt.io)
3. Paste token
4. Check payload should have:
   ```json
   {
     "loginId": "2000",
     "device": "device_xxx",
     "clientid": "app",  // ✅ MUST be present!
     "iat": 1738262400,
     "exp": 1738348800
   }
   ```

### Method 3: Backend Gateway Logs

Check Gateway console for:
```
✅ Token验证成功: userId=2000, clientid=app
```

If you see:
```
❌ 客户端ID与Token不匹配
```
→ Token doesn't have `clientid` stored correctly (need to re-login)

---

## 🐛 Troubleshooting

### Issue 1: "401 认证失败" on All API Calls

**Symptoms**:
- Login works
- All other API calls return 401

**Root Cause**: Token doesn't contain `clientid`

**Solution**: Re-login to get new token
```
1. Clear app data or logout
2. Login again
3. New token will have clientid stored correctly
```

**Why**: Old tokens (before fix) didn't have `clientid` in JWT extras.  
Backend was fixed to store clientid in token (not just Redis session).

---

### Issue 2: "客户端ID与Token不匹配"

**Symptoms**:
- Gateway logs show this error
- Return 401

**Root Cause**: `clientid` header doesn't match `clientid` in token

**Solution**: Ensure consistent clientType
```typescript
// Login
await authApi.loginWithPassword({
  username: 'alice_dev',
  password: '123456',
  clientType: 'app',  // ← Must be 'app'
});

// API Client
apiClient.setClientId('app');  // ← Must match login clientType
```

**Check** (in `client.ts` line 152):
```typescript
private clientId: string = 'app';  // ✅ Default is 'app'
```

---

### Issue 3: Token Not Being Sent

**Symptoms**:
- Backend doesn't receive `Authorization` header
- Gateway returns 401 immediately

**Debug Steps**:

1. **Check AuthStore has token**:
   ```typescript
   const { accessToken } = useAuthStore();
   console.log('Token:', accessToken);  // Should be a JWT string
   ```

2. **Check API Client is connected to AuthStore** (`client.ts` lines 174-180):
   ```typescript
   // In app initialization (e.g., _layout.tsx)
   apiClient.connectAuthStore(useAuthStore);
   ```

3. **Check request headers**:
   Look for console log:
   ```
   🔑 [第三层] API请求拦截 - 已自动添加token
   ```

   If you see:
   ```
   📡 [第三层] API请求 - 无token（匿名请求）
   ```
   → Token not being injected (AuthStore not connected or token is null)

---

### Issue 4: Token Refresh Loop

**Symptoms**:
- App keeps refreshing token
- Never completes request

**Root Cause**: Refresh token is also expired or invalid

**Solution**: Force re-login
```typescript
// Clear auth data
await authStore.clearAuthData();

// Redirect to login
router.replace('/auth/login');
```

---

## 🎯 Best Practices

### 1. Always Use the Same ClientType

**❌ Bad**:
```typescript
// Login with 'web'
await authApi.loginWithPassword({ clientType: 'web' });

// API client uses 'app'
apiClient.setClientId('app');  // ← Mismatch!
```

**✅ Good**:
```typescript
// Login with 'app'
await authApi.loginWithPassword({ clientType: 'app' });

// API client uses 'app'
apiClient.setClientId('app');  // ← Consistent!
```

### 2. Connect AuthStore to API Client Early

**In** `app/_layout.tsx` **or** `app/index.tsx`:
```typescript
import { apiClient } from '@/services/api/client';
import { useAuthStore } from '@/features/AuthModule/stores/authStore';

export default function RootLayout() {
  useEffect(() => {
    // Connect API client to auth store
    apiClient.connectAuthStore(useAuthStore);
    
    // Set client ID
    apiClient.setClientId('app');
  }, []);
  
  // ...rest
}
```

### 3. Handle 401 Gracefully

The API client already does this automatically (`client.ts` lines 209-344), but you can add UI feedback:

```typescript
// In your API error handler
try {
  const profile = await profileApi.getUserProfile(userId);
} catch (error) {
  if (error.requireLogin) {
    // User needs to login
    Alert.alert('登录过期', '请重新登录', [
      { text: '确定', onPress: () => router.replace('/auth/login') }
    ]);
  }
}
```

---

## 📊 Summary

### ✅ Current Setup (Correct)

| Component | Configuration | Status |
|-----------|--------------|--------|
| **Backend Token Name** | `Authorization` | ✅ |
| **Backend Token Prefix** | `Bearer` | ✅ |
| **Frontend Header Format** | `Authorization: Bearer <token>` | ✅ |
| **ClientId Header** | `clientid: app` | ✅ |
| **Token Storage** | SecureStore (encrypted) | ✅ |
| **Auto Token Injection** | Yes (via apiClient) | ✅ |
| **Auto Token Refresh** | Yes (on 401) | ✅ |
| **ClientId in Token** | Yes (stored in JWT extras) | ✅ |

### 🔄 Token Lifecycle

```
Login → Store → Auto-Inject → Validate → Refresh → Re-Inject
  ↓       ↓         ↓            ↓          ↓         ↓
  ✅      ✅        ✅           ✅         ✅        ✅
```

All steps are working correctly! 🎉

---

**Last Updated**: 2025-01-30  
**Status**: ✅ Working  
**Next Review**: When backend changes token format


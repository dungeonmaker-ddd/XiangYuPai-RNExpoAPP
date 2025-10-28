# 🧭 Homepage Navigation Guide

> **Enhanced Navigation System for MainPage**  
> **Updated:** 2025-10-27  
> **Status:** ✅ Navigation handlers added

---

## 📋 Overview

The `MainPage` component now has **enhanced navigation capabilities** to connect with:
- ✅ **Profile Module** (个人主页模块)
- ✅ **Discovery Module** (发现页面模块)
- ✅ **Post Detail Pages** (动态详情)

---

## 🚀 Available Navigation Handlers

### 1. **handleUserPress** - User Detail Modal

**Purpose:** Quick view of user information in a modal overlay

```typescript
handleUserPress(user: UserCard)
```

**Navigation:**
```
MainPage → /modal/user-detail
```

**Use Case:** Quick user info without leaving current page

**Example:**
```typescript
<UserCard 
  user={user}
  onPress={() => handleUserPress(user)}
/>
```

---

### 2. **handleViewUserProfile** - Full Profile Page ⭐ NEW

**Purpose:** Navigate to user's complete profile page with all tabs

```typescript
handleViewUserProfile(userId: string)
```

**Navigation:**
```
MainPage → /(tabs)/profile
```

**Profile Features:**
- 📸 Dynamic Tab - User's posts
- ⭐ Collection Tab - Saved content
- ❤️ Likes Tab - Liked content
- 📋 Profile Info Tab - Personal information

**Use Case:** View complete user profile with all interactions

**Example:**
```typescript
<Button 
  title="查看主页"
  onPress={() => handleViewUserProfile(user.id)}
/>
```

---

### 3. **handleGoToDiscovery** - Discovery Feed ⭐ NEW

**Purpose:** Navigate to discovery page to explore content

```typescript
handleGoToDiscovery()
```

**Navigation:**
```
MainPage → /(tabs)/discover
```

**Discovery Features:**
- 🔥 Hot Tab - Trending posts
- 👥 Follow Tab - Posts from followed users
- 📍 Local Tab - Nearby posts (spatial index)

**Use Case:** Explore social content feed

**Example:**
```typescript
<Button 
  title="发现更多"
  onPress={handleGoToDiscovery}
/>
```

---

### 4. **handleViewPost** - Post Detail ⭐ NEW

**Purpose:** View detailed post with comments and interactions

```typescript
handleViewPost(postId: string)
```

**Navigation:**
```
MainPage → /feed/[id]
```

**Post Detail Features:**
- 📝 Full content display
- 💬 Comments section
- ❤️ Like/Collect/Share actions
- 👤 Author information

**Use Case:** Deep dive into specific post

**Example:**
```typescript
<PostCard 
  post={post}
  onPress={() => handleViewPost(post.id)}
/>
```

---

## 🎯 Usage Examples

### Example 1: User Card with Multiple Actions

```typescript
<View style={styles.userCard}>
  {/* Quick View */}
  <TouchableOpacity onPress={() => handleUserPress(user)}>
    <Avatar source={user.avatar} />
  </TouchableOpacity>
  
  {/* View Full Profile */}
  <Button 
    title="查看主页"
    onPress={() => handleViewUserProfile(user.id)}
  />
</View>
```

---

### Example 2: Limited Offers Section

```typescript
<LimitedOffersArea
  offers={limitedOffers}
  onUserPress={handleUserPress}          // Quick modal
  onMorePress={handleViewUserProfile}     // Full profile
/>
```

---

### Example 3: Content Preview Section

```typescript
<View style={styles.contentPreview}>
  <Text>最新动态</Text>
  
  {/* View Post Detail */}
  <TouchableOpacity onPress={() => handleViewPost(post.id)}>
    <PostPreview post={post} />
  </TouchableOpacity>
  
  {/* Go to Discovery */}
  <Button 
    title="查看更多动态"
    onPress={handleGoToDiscovery}
  />
</View>
```

---

## 📐 Architecture Diagram

```
MainPage
  ├─ handleUserPress()
  │  └─ /modal/user-detail (Quick View)
  │
  ├─ handleViewUserProfile()
  │  └─ /(tabs)/profile (Full Profile)
  │     ├─ DynamicPage
  │     ├─ CollectionPage
  │     ├─ LikesPage
  │     └─ ProfileInfoPage
  │
  ├─ handleGoToDiscovery()
  │  └─ /(tabs)/discover (Discovery Feed)
  │     ├─ Follow Tab
  │     ├─ Hot Tab
  │     └─ Local Tab
  │
  └─ handleViewPost()
     └─ /feed/[id] (Post Detail)
        ├─ Content Display
        ├─ Comments
        └─ Interactions
```

---

## 🔄 Integration with Components

### UserListArea Integration

```typescript
<UserListArea
  users={users}
  loading={loading}
  onUserPress={handleUserPress}           // ✅ Already integrated
  refreshing={refreshing}
  onRefresh={handleRefresh}
  ListHeaderComponent={renderListHeader}
/>

// TODO: Add profile navigation option
// onViewProfile={handleViewUserProfile}
```

---

### LimitedOffersArea Enhancement

```typescript
<LimitedOffersArea
  offers={limitedOffers}
  onUserPress={handleUserPress}           // ✅ Quick view
  onMorePress={handleViewUserProfile}     // ⭐ NEW: Full profile
/>
```

---

### Header Search Integration

```typescript
<HeaderArea
  location={location}
  onLocationPress={handleLocationPress}
  onSearch={handleSearch}
  onSearchPress={handleSearchPress}
  onDiscoveryPress={handleGoToDiscovery}  // ⭐ NEW: Link to discovery
/>
```

---

## 🎨 UI/UX Recommendations

### 1. User Card Actions

**Before:**
```
[User Avatar] → Modal only
```

**After (Recommended):**
```
[User Avatar] → Long press menu
  - 快速查看 (Modal)
  - 查看主页 (Profile)
  - 发送消息
  - 关注/取消关注
```

---

### 2. Content Preview Actions

**Recommended Actions:**
```tsx
<PostPreviewCard>
  <PostContent onPress={() => handleViewPost(post.id)} />
  <PostActions>
    <LikeButton />
    <CommentButton onPress={() => handleViewPost(post.id)} />
    <ShareButton />
  </PostActions>
  <AuthorInfo onPress={() => handleViewUserProfile(post.authorId)} />
</PostPreviewCard>
```

---

### 3. Discovery Entry Points

**Recommended Placements:**
```
1. Header right button
   [Search Icon] [Discovery Icon]

2. Team Party area
   [查看组局中心] [查看发现页面]

3. Limited Offers area
   [查看更多专享] [浏览所有动态]
```

---

## 🔧 Backend Integration Status

### Profile Module

**API Status:** ✅ Created, ⏳ Not Connected

- ✅ `services/api/profileApi.ts` (28 endpoints)
- ✅ `stores/profileStore.ts` (Zustand)
- ⏳ **TODO:** Connect real API to UI
- ⏳ **TODO:** Replace mock data

**Backend Module:** `xypai-user` (RuoYi-Cloud-Plus)

---

### Discovery Module

**API Status:** ✅ **Fully Integrated!**

- ✅ `services/api/discoveryApi.ts` (14 endpoints)
- ✅ `stores/discoveryStore.ts` (Zustand)
- ✅ Real API calls working
- ✅ Optimistic UI updates

**Backend Module:** `xypai-content` (RuoYi-Cloud-Plus)

---

## 📝 Next Steps

### Phase 1: UI Integration (Current)

- [x] Add navigation handlers
- [ ] Update UserListArea to show profile option
- [ ] Add discovery entry point in header
- [ ] Add post preview cards with navigation

---

### Phase 2: Profile Backend Connection

- [ ] Update `profileStore.ts` to use real API
- [ ] Replace mock data in Profile pages
- [ ] Test profile navigation flow
- [ ] Add error handling

---

### Phase 3: Deep Linking

- [ ] Configure deep link routes
- [ ] Add share functionality
- [ ] Test external navigation
- [ ] Add analytics tracking

---

## 🐛 Known Issues

### Issue 1: Profile Shows Own Data Only

**Problem:** Profile page doesn't accept `userId` parameter yet

**Solution:**
```typescript
// TODO: Update Profile/MainPage/index.tsx
export interface MainPageProps {
  userId?: string;  // ⭐ Add this
  initialTab?: TabType;
}

// Update useEffect to load user by ID
useEffect(() => {
  if (userId) {
    loadUserProfile(userId);
  } else {
    loadCurrentUserProfile();
  }
}, [userId]);
```

---

### Issue 2: Post Detail Route Not Created

**Problem:** `/feed/[id]` route doesn't exist

**Solution:**
```typescript
// TODO: Create app/feed/[id].tsx
import DetailPage from '@/src/features/Discovery/DetailPage';

export default function FeedDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <DetailPage feedId={id} />;
}
```

---

## 🎯 Testing Checklist

### Navigation Testing

- [ ] Click user avatar → Opens modal
- [ ] Click "查看主页" → Opens profile
- [ ] Click "发现" → Opens discovery feed
- [ ] Click post preview → Opens post detail
- [ ] Back button works correctly
- [ ] Deep links work (if implemented)

---

### Integration Testing

- [ ] Profile loads correct user data
- [ ] Discovery shows latest posts
- [ ] Post detail displays correctly
- [ ] Comments load properly
- [ ] Like/collect actions work

---

## 📚 Related Documentation

### Module Documentation

- **Profile Module:** `src/features/Profile/README.md`
- **Discovery Module:** `src/features/Discovery/README.md`
- **Homepage Module:** `src/features/Homepage/README.md`

### API Documentation

- **Profile API Guide:** `src/features/Profile/API_INTEGRATION_GUIDE.md`
- **Discovery API Complete:** `src/features/Discovery/API_INTEGRATION_COMPLETE.md`

### Architecture

- **Universal Architecture:** `.cursor/rules/UNIVERSAL_COMPONENT_ARCHITECTURE_CORE.md`
- **Backend Design:** `RuoYi-Cloud-Plus/.cursor/rules/PL.md`

---

## 🎉 Summary

### ✅ Completed

- ✅ Navigation handlers added to MainPage
- ✅ Discovery module fully integrated with backend
- ✅ Profile module structure complete

### ⏳ Pending

- ⏳ Profile backend connection
- ⏳ UI components update to use new handlers
- ⏳ Deep linking setup
- ⏳ Analytics tracking

### 🚀 Ready to Use

- ✅ Discovery feed navigation
- ✅ User profile navigation
- ✅ Post detail navigation (route needs creation)

---

**Created:** 2025-10-27  
**Version:** 1.0  
**Status:** ✅ Navigation Enhanced  
**Next:** UI Integration Phase


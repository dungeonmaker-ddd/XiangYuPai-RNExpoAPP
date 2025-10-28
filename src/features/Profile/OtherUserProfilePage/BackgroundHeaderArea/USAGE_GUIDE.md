# 🚀 BackgroundHeaderArea 使用指南

## 📌 快速开始

### 基本用法

```tsx
import BackgroundHeaderArea from './BackgroundHeaderArea';

<BackgroundHeaderArea
  backgroundImage="https://example.com/user-bg.jpg"
  nickname="昵称12345"
  gender={2}  // 1: 男, 2: 女
  isFollowing={false}
  onFollowPress={() => handleFollow()}
/>
```

---

## 🎯 完整功能示例

### 示例 1: 完整的用户卡片

```tsx
<BackgroundHeaderArea
  // 背景图
  backgroundImage="https://example.com/user-bg.jpg"
  
  // 基本信息
  nickname="昵称12345"
  age={25}
  gender={2}  // 1: 男生, 2: 女孩
  
  // 认证状态
  isRealVerified={true}    // 真人认证
  isGodVerified={true}     // 大神认证
  isVipVerified={true}     // VIP认证
  
  // 状态信息
  isBookable={true}        // 可预约
  distance={4.6}           // 距离 km
  followerCount={102}      // 粉丝数
  
  // 关注状态
  isFollowing={false}
  isMutualFollowing={false}
  
  // 事件处理
  onFollowPress={handleFollowPress}
  onShare={handleShare}
/>
```

### 示例 2: 自定义标签系统

```tsx
<BackgroundHeaderArea
  nickname="热门创作者"
  gender={2}
  isRealVerified={true}
  
  // 🎨 自定义标签
  customTags={[
    {
      text: '热门',
      backgroundColor: '#FFEBEE',
      textColor: '#F44336',
      icon: 'flame',
    },
    {
      text: '推荐',
      backgroundColor: '#E3F2FD',
      textColor: '#2196F3',
      icon: 'heart',
    },
    {
      text: '活跃',
      backgroundColor: '#E8F5E9',
      textColor: '#4CAF50',
      icon: 'pulse',
    },
  ]}
  
  distance={2.3}
  followerCount={1520}
  isFollowing={false}
  onFollowPress={handleFollowPress}
/>
```

### 示例 3: 互相关注状态

```tsx
<BackgroundHeaderArea
  nickname="好友名称"
  gender={1}
  
  // ✅ 互相关注
  isFollowing={true}
  isMutualFollowing={true}  // 互相关注状态
  
  distance={1.2}
  followerCount={856}
  onFollowPress={handleFollowPress}
/>
```

---

## 📋 Props 完整文档

### 基础信息 Props

| Prop | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `backgroundImage` | `string` | ❌ | - | 背景图片 URL |
| `nickname` | `string` | ✅ | - | 用户昵称 |
| `age` | `number` | ❌ | - | 年龄（已弃用，保留兼容性） |
| `gender` | `number` | ❌ | - | 性别：1-男生，2-女孩 |

### 认证状态 Props

| Prop | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `isRealVerified` | `boolean` | ❌ | `false` | 真人认证（蓝色标签） |
| `isGodVerified` | `boolean` | ❌ | `false` | 大神认证（金色标签） |
| `isVipVerified` | `boolean` | ❌ | `false` | VIP认证（紫色标签） |

### 状态信息 Props

| Prop | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `isBookable` | `boolean` | ❌ | `false` | 是否可预约 |
| `distance` | `number` | ❌ | - | 距离（单位：km） |
| `followerCount` | `number` | ❌ | - | 粉丝数量 |

### 关注状态 Props

| Prop | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `isFollowing` | `boolean` | ❌ | `false` | 是否已关注 |
| `isMutualFollowing` | `boolean` | ❌ | `false` | 是否互相关注 |

### 自定义标签 Props

| Prop | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `customTags` | `TagItem[]` | ❌ | `[]` | 自定义标签数组 |

#### TagItem 接口：
```typescript
interface TagItem {
  text: string;              // 标签文字
  backgroundColor: string;   // 背景颜色（HEX）
  textColor: string;         // 文字颜色（HEX）
  icon?: string;             // Ionicons 图标名称（可选）
}
```

### 事件回调 Props

| Prop | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `onFollowPress` | `() => void` | ❌ | - | 关注按钮点击回调 |
| `onShare` | `() => void` | ❌ | - | 分享按钮点击回调（预留） |

---

## 🎨 标签颜色方案

### 推荐的标签配色

#### 认证类标签
```typescript
// 真人认证
{
  text: '真人认证',
  backgroundColor: '#E3F2FD',
  textColor: '#2196F3',
  icon: 'checkmark-circle',
}

// 大神
{
  text: '大神',
  backgroundColor: '#FFF3E0',
  textColor: '#FF9800',
  icon: 'star',
}

// VIP
{
  text: 'VIP',
  backgroundColor: '#F3E5F5',
  textColor: '#9C27B0',
  icon: 'diamond',
}
```

#### 状态类标签
```typescript
// 热门
{
  text: '热门',
  backgroundColor: '#FFEBEE',
  textColor: '#F44336',
  icon: 'flame',
}

// 推荐
{
  text: '推荐',
  backgroundColor: '#E3F2FD',
  textColor: '#2196F3',
  icon: 'heart',
}

// 新人
{
  text: '新人',
  backgroundColor: '#E8F5E9',
  textColor: '#4CAF50',
  icon: 'leaf',
}

// 活跃
{
  text: '活跃',
  backgroundColor: '#FFF9C4',
  textColor: '#F57F17',
  icon: 'pulse',
}
```

#### 等级类标签
```typescript
// LV1-5
{
  text: 'LV3',
  backgroundColor: '#E0F2F1',
  textColor: '#00796B',
  icon: 'trophy',
}

// 精英
{
  text: '精英',
  backgroundColor: '#FCE4EC',
  textColor: '#C2185B',
  icon: 'ribbon',
}
```

---

## 🔧 常见使用场景

### 场景 1: 用户列表卡片
在用户列表中显示简化的用户信息：

```tsx
<BackgroundHeaderArea
  backgroundImage={user.backgroundImage}
  nickname={user.nickname}
  gender={user.gender}
  isRealVerified={user.isRealVerified}
  distance={user.distance}
  followerCount={user.followerCount}
  isFollowing={user.isFollowing}
  onFollowPress={() => handleFollow(user.id)}
/>
```

### 场景 2: 用户详情页
显示完整的用户信息和所有标签：

```tsx
<BackgroundHeaderArea
  backgroundImage={userDetail.backgroundImage}
  nickname={userDetail.nickname}
  gender={userDetail.gender}
  isRealVerified={userDetail.isRealVerified}
  isGodVerified={userDetail.isGodVerified}
  isVipVerified={userDetail.isVipVerified}
  customTags={userDetail.customTags}
  isBookable={userDetail.isBookable}
  distance={userDetail.distance}
  followerCount={userDetail.followerCount}
  isFollowing={userDetail.isFollowing}
  isMutualFollowing={userDetail.isMutualFollowing}
  onFollowPress={() => handleFollow(userDetail.id)}
  onShare={() => handleShare(userDetail.id)}
/>
```

### 场景 3: 搜索结果
在搜索结果中显示匹配的用户：

```tsx
{searchResults.map((user) => (
  <BackgroundHeaderArea
    key={user.id}
    backgroundImage={user.backgroundImage}
    nickname={user.nickname}
    gender={user.gender}
    isRealVerified={user.isRealVerified}
    distance={user.distance}
    followerCount={user.followerCount}
    isFollowing={user.isFollowing}
    onFollowPress={() => handleFollow(user.id)}
  />
))}
```

---

## 💡 最佳实践

### 1. 性能优化
```tsx
// ✅ 使用 React.memo 优化列表渲染
const MemoizedBackgroundHeader = React.memo(BackgroundHeaderArea);

// ✅ 使用 useCallback 优化回调
const handleFollow = useCallback((userId: string) => {
  // 关注逻辑
}, []);

<MemoizedBackgroundHeader
  onFollowPress={() => handleFollow(user.id)}
/>
```

### 2. 图片加载优化
```tsx
// ✅ 使用图片CDN缩略图
<BackgroundHeaderArea
  backgroundImage={`${user.backgroundImage}?w=800&h=500&fit=cover`}
/>

// ✅ 提供占位图
<BackgroundHeaderArea
  backgroundImage={user.backgroundImage || DEFAULT_BACKGROUND_IMAGE}
/>
```

### 3. 自定义标签管理
```tsx
// ✅ 从后端获取标签配置
const customTags = useMemo(() => {
  return user.tags.map(tag => ({
    text: tag.name,
    backgroundColor: tag.bgColor,
    textColor: tag.textColor,
    icon: tag.icon,
  }));
}, [user.tags]);

<BackgroundHeaderArea
  customTags={customTags}
/>
```

### 4. 状态管理
```tsx
// ✅ 使用状态管理跟踪关注状态
const [isFollowing, setIsFollowing] = useState(user.isFollowing);
const [isMutual, setIsMutual] = useState(user.isMutualFollowing);

const handleFollow = async () => {
  try {
    if (isFollowing) {
      await unfollowUser(user.id);
      setIsFollowing(false);
      setIsMutual(false);
    } else {
      const result = await followUser(user.id);
      setIsFollowing(true);
      setIsMutual(result.isMutual);
    }
  } catch (error) {
    console.error('关注操作失败', error);
  }
};

<BackgroundHeaderArea
  isFollowing={isFollowing}
  isMutualFollowing={isMutual}
  onFollowPress={handleFollow}
/>
```

---

## 🎯 Ionicons 图标参考

常用的图标名称（用于自定义标签）：

### 认证类
- `checkmark-circle` - 认证
- `shield-checkmark` - 安全认证
- `star` - 星标/大神
- `diamond` - 钻石/VIP
- `trophy` - 奖杯/成就

### 状态类
- `flame` - 火焰/热门
- `heart` - 心形/喜欢
- `pulse` - 脉搏/活跃
- `leaf` - 叶子/新人
- `ribbon` - 丝带/精英

### 功能类
- `calendar` - 日历/可预约
- `location` - 定位/距离
- `people` - 人群/粉丝
- `time` - 时间
- `camera` - 相机

更多图标请参考：[Ionicons 官方文档](https://ionic.io/ionicons)

---

## ⚠️ 注意事项

### 1. 背景图片
- 建议尺寸：至少 800x500 像素
- 支持格式：JPEG、PNG、WebP
- 建议使用CDN加速

### 2. 标签数量
- 认证标签：建议不超过 3 个
- 自定义标签：建议不超过 4 个
- 总标签数：建议不超过 6 个（避免换行过多）

### 3. 性能考虑
- 在列表中使用时，建议使用 `React.memo`
- 大量用户列表建议使用虚拟滚动
- 图片加载建议使用懒加载

### 4. 兼容性
- 保留了原有的 `age` prop（虽然不再显示）
- 所有新增 Props 都是可选的
- 向后兼容旧版本使用方式

---

## 🐛 故障排查

### 问题 1: 渐变效果不显示
**原因：** `expo-linear-gradient` 未安装
**解决：**
```bash
npx expo install expo-linear-gradient
```

### 问题 2: 标签图标不显示
**原因：** Ionicons 图标名称错误
**解决：** 检查图标名称是否在 Ionicons 库中存在

### 问题 3: 背景图片不加载
**原因：** 图片 URL 无效或网络问题
**解决：** 检查图片 URL，提供默认占位图

### 问题 4: 文字被截断
**原因：** 昵称过长
**解决：** 已自动使用 `numberOfLines={1}` 处理，会显示省略号

---

## 📞 技术支持

如有问题，请参考：
- [组件改进报告](./MODERNIZATION_COMPLETE.md)
- [React Native 文档](https://reactnative.dev/)
- [Expo 文档](https://docs.expo.dev/)

---

*最后更新：2024年*
*组件版本：2.0（现代化版本）*


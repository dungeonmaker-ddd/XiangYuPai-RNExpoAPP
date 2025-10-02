# MessageItem - 消息列表项组件

> **基于Button.tsx的八段式架构模板**
> 
> 核心共享组件，用于统一展示对话和通知列表项

---

## 📋 **组件概览**

MessageItem是消息模块最核心的共享组件，用于统一展示对话列表和通知列表项的UI。

### 🎯 **核心功能**

- ✅ 统一的消息列表项UI结构
- ✅ 支持对话和通知两种类型
- ✅ 未读状态视觉区分（加粗标题）
- ✅ 未读角标显示（支持99+）
- ✅ 智能时间格式化（刚刚、分钟前、小时前、天前、日期）
- ✅ 按压动画效果（缩放动画）
- ✅ 长按菜单支持

### 🎨 **设计规范**

- **高度**: 80px
- **头像**: 48x48px 圆形
- **字体**: 标题16sp粗体（未读）/常规（已读），副标题14sp，时间12sp
- **颜色**: 与现有Button组件统一的主题配色
- **动画**: 按压缩放至0.98，弹性恢复

---

## 💻 **使用方式**

### 基础用法

```typescript
import { MessageItem } from '@/src/features/Messages';

<MessageItem
  id="conv-1"
  type="conversation"
  avatar="https://example.com/avatar.jpg"
  title="张三"
  subtitle="你好，在吗？"
  timestamp={Date.now() - 60000}
  isRead={false}
  unreadCount={3}
  onPress={() => router.push('/messages/chat/conv-1')}
/>
```

### 已读消息

```typescript
<MessageItem
  id="conv-2"
  type="conversation"
  avatar="https://example.com/avatar2.jpg"
  title="李四"
  subtitle="好的，明天见"
  timestamp={Date.now() - 3600000}
  isRead={true}
  unreadCount={0}
  onPress={() => router.push('/messages/chat/conv-2')}
/>
```

### 带长按菜单

```typescript
<MessageItem
  id="conv-3"
  type="conversation"
  avatar="https://example.com/avatar3.jpg"
  title="王五"
  subtitle="收到"
  timestamp={Date.now() - 86400000}
  isRead={true}
  onPress={() => router.push('/messages/chat/conv-3')}
  onLongPress={() => showActionSheet(['删除对话', '置顶', '标记未读'])}
  onDelete={() => deleteConversation('conv-3')}
/>
```

---

## 📋 **Props接口**

```typescript
interface MessageItemProps {
  // 基础数据
  id: string                              // 消息ID
  type: 'conversation' | 'notification'   // 类型（对话/通知）
  
  // 用户信息
  avatar: string                          // 头像URL
  title: string                           // 标题（用户名）
  subtitle: string                        // 副标题（最后一条消息）
  
  // 状态信息
  timestamp: number                       // 时间戳（毫秒）
  isRead: boolean                         // 是否已读
  unreadCount?: number                    // 未读数量（可选）
  
  // 交互配置
  onPress: () => void                     // 点击回调
  onLongPress?: () => void                // 长按回调（可选）
  onDelete?: () => void                   // 删除回调（可选）
  
  // 样式配置
  style?: StyleProp<ViewStyle>            // 自定义样式（可选）
}
```

---

## 🎨 **样式定制**

### 自定义颜色

修改 `constants.ts` 中的颜色配置：

```typescript
export const COLORS = {
  background: '#FFFFFF',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  unreadBadge: '#EF4444',  // 修改未读角标颜色
  // ...
};
```

### 自定义尺寸

修改 `constants.ts` 中的尺寸配置：

```typescript
export const SIZES = {
  containerHeight: 80,     // 修改列表项高度
  avatarSize: 48,          // 修改头像大小
  unreadBadgeSize: 20,     // 修改角标大小
  // ...
};
```

---

## ⚡ **性能优化**

### 已实施的优化

- ✅ `React.memo()` 包装主组件
- ✅ `useMemo()` 缓存时间格式化
- ✅ `useCallback()` 缓存事件处理
- ✅ 子组件 `Avatar` 和 `UnreadBadge` 使用memo

### 列表优化建议

在FlatList中使用时：

```typescript
<FlatList
  data={conversations}
  renderItem={({ item }) => (
    <MessageItem
      key={item.id}
      {...item}
      onPress={() => handlePress(item.id)}
    />
  )}
  keyExtractor={(item) => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
/>
```

---

## 🔧 **开发指南**

### 修改组件结构

所有修改都在 `index.tsx` 的对应段落中进行：

- **#region 3**: 修改类型定义
- **#region 4**: 修改常量配置
- **#region 5**: 修改工具函数（如时间格式化）
- **#region 6**: 修改状态管理
- **#region 8**: 修改UI渲染

### 添加新功能

例如添加在线状态指示器：

1. 在 `types.ts` 中添加 `showOnline?: boolean`
2. 在 `constants.ts` 中添加在线状态颜色
3. 在 `index.tsx` #region 8 中添加在线状态显示逻辑

---

## 📖 **相关文档**

- [Button.tsx](../../../components/ui/Button.tsx) - 八段式架构模板参考
- [消息模块架构设计](../../README.md) - 模块整体架构
- [UNIVERSAL_COMPONENT_ARCHITECTURE_CORE](../../../../../.cursor/rules/) - 核心架构标准

---

**📅 创建时间**: 2025年9月  
**🔄 最后更新**: 2025年9月  
**📝 维护者**: 开发团队  
**🎯 版本**: v1.0  
**🏆 质量标准**: 基于Button.tsx的A级标准

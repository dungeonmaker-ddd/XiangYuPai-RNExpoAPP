# API白名单与认证流程指南

## 📋 概述

本指南说明如何使用新的API白名单系统，实现**访客模式**与**登录引导**的智能切换。

---

## 🎯 三种认证类型

### 1. **ANONYMOUS（匿名访问）**
- ✅ 允许未登录用户访问
- ✅ 401错误时使用降级方案（模拟数据/空数据）
- ❌ **不会**触发登录跳转

**适用场景：**
- 首页用户列表
- 发现页公开内容
- 用户公开主页

### 2. **OPTIONAL_AUTH（可选认证）**
- ✅ 登录后功能更完整（可点赞、评论）
- ✅ 未登录也能查看基础内容
- ⚠️ 401错误时尝试刷新token，失败则降级

**适用场景：**
- 内容详情页（登录后可互动）
- 用户主页（登录后可发消息）

### 3. **REQUIRED_AUTH（必须登录）**
- ❌ 未登录**不能访问**
- ❌ 401错误时**引导用户登录**
- ✅ Token过期会自动刷新

**适用场景：**
- 消息/聊天模块
- 个人资料管理
- 交易/支付模块

---

## 🛠️ 使用方法

### **1. 配置白名单**

在 `services/api/whitelist.ts` 中添加规则：

```typescript
{
  pattern: /^\/xypai-user\/api\/v1\/users\/list/,
  type: WhitelistType.ANONYMOUS,
  description: '首页用户列表（访客可浏览）',
}
```

### **2. 业务层处理错误**

#### **场景A：匿名接口（ANONYMOUS）**

```typescript
// 示例：首页用户列表
async function getUserList() {
  try {
    const response = await apiClient.get('/xypai-user/api/v1/users/list');
    return response.data;
  } catch (error: any) {
    // ✅ 检查是否可以使用降级方案
    if (error.canUseFallback) {
      console.log('🌐 使用降级方案：', error.message);
      return getMockUserList(); // 返回模拟数据
    }
    
    // 其他错误照常处理
    throw error;
  }
}
```

#### **场景B：可选认证（OPTIONAL_AUTH）**

```typescript
// 示例：内容详情页
async function getContentDetail(id: string) {
  try {
    const response = await apiClient.get(`/xypai-content/api/v1/contents/${id}/detail`);
    return {
      ...response.data,
      canInteract: true, // 已登录，可以互动
    };
  } catch (error: any) {
    if (error.canUseFallback) {
      console.log('🔓 访客模式：只显示基础内容');
      const basicContent = await getBasicContent(id);
      return {
        ...basicContent,
        canInteract: false, // 未登录，隐藏互动按钮
      };
    }
    
    throw error;
  }
}
```

#### **场景C：必须登录（REQUIRED_AUTH）**

```typescript
// 示例：发送消息
async function sendMessage(conversationId: string, content: string) {
  try {
    const response = await apiClient.post('/xypai-chat/api/v1/messages', {
      conversationId,
      content,
    });
    return response.data;
  } catch (error: any) {
    // ✅ 检查是否需要登录
    if (error.requireLogin) {
      console.log('🔒 需要登录');
      
      // 方式1：使用路由跳转
      router.push('/auth/login');
      
      // 方式2：显示登录弹窗
      showLoginModal();
      
      // 方式3：Toast提示
      Toast.show({
        type: 'info',
        text1: '请先登录',
        text2: '登录后可以发送消息',
        onPress: () => router.push('/auth/login'),
      });
      
      return;
    }
    
    throw error;
  }
}
```

---

## 📊 错误对象属性

```typescript
interface ApiError {
  type: string;          // 错误类型
  message: string;       // 错误消息
  code?: number;         // HTTP状态码
  
  // 🆕 白名单相关属性
  canUseFallback?: boolean;      // 是否可以使用降级方案
  whitelistType?: WhitelistType; // 白名单类型
  requireLogin?: boolean;        // 是否需要跳转登录
}
```

---

## 🎨 UI层处理建议

### **1. 首页/发现页（ANONYMOUS）**

```tsx
function HomePage() {
  const [users, setUsers] = useState([]);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  
  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getUserList();
        setUsers(data);
        setIsUsingFallback(false);
      } catch (error: any) {
        if (error.canUseFallback) {
          // 使用模拟数据，不影响用户体验
          setUsers(getMockUsers());
          setIsUsingFallback(true);
        } else {
          // 显示错误提示
          showError(error.message);
        }
      }
    }
    
    loadUsers();
  }, []);
  
  return (
    <View>
      {isUsingFallback && (
        <Banner type="info">
          当前使用示例数据，实际功能需要后端支持
        </Banner>
      )}
      
      <UserList data={users} />
    </View>
  );
}
```

### **2. 内容详情页（OPTIONAL_AUTH）**

```tsx
function ContentDetail({ id }: { id: string }) {
  const { isAuthenticated } = useAuthStore();
  const [content, setContent] = useState(null);
  const [canInteract, setCanInteract] = useState(false);
  
  useEffect(() => {
    async function loadContent() {
      try {
        const data = await getContentDetail(id);
        setContent(data);
        setCanInteract(data.canInteract);
      } catch (error: any) {
        if (error.canUseFallback) {
          // 访客模式：显示基础内容
          const basic = await getBasicContent(id);
          setContent(basic);
          setCanInteract(false);
        }
      }
    }
    
    loadContent();
  }, [id]);
  
  return (
    <View>
      <ContentView data={content} />
      
      {/* 登录后才显示互动按钮 */}
      {canInteract ? (
        <ActionButtons onLike={...} onComment={...} />
      ) : (
        <LoginPrompt 
          message="登录后可以点赞、评论"
          onPress={() => router.push('/auth/login')}
        />
      )}
    </View>
  );
}
```

### **3. 消息页（REQUIRED_AUTH）**

```tsx
function MessagesPage() {
  const { isAuthenticated } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  
  // 在页面内检查登录状态
  if (!isAuthenticated) {
    return (
      <LoginPrompt 
        title="查看消息需要登录"
        description="登录后可以与其他用户聊天"
        onLogin={() => router.push('/auth/login')}
      />
    );
  }
  
  useEffect(() => {
    async function loadConversations() {
      try {
        const data = await getConversations();
        setConversations(data);
      } catch (error: any) {
        if (error.requireLogin) {
          // 登录过期，清除状态并跳转
          showToast('登录已过期，请重新登录');
          router.replace('/auth/login');
        }
      }
    }
    
    loadConversations();
  }, []);
  
  return <ConversationList data={conversations} />;
}
```

---

## 🔍 调试日志

开启后，API请求会输出详细的白名单检查日志：

```log
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 [第三层] 检测到401错误 - 智能处理
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   请求URL: /xypai-user/api/v1/users/list
   白名单类型: anonymous
   规则: 首页用户列表（访客可浏览）
   处理: 🌐 匿名接口，允许降级方案
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## ✅ 最佳实践

### 1. **优先使用后端白名单**
- 在后端API上添加 `@Anonymous` 注解
- 前端白名单作为**后端白名单的临时替代**

### 2. **区分访客模式和登录引导**
- 首页/发现页：使用 `ANONYMOUS`，默默降级
- 详情页：使用 `OPTIONAL_AUTH`，提示登录更好
- 功能页：使用 `REQUIRED_AUTH`，明确要求登录

### 3. **错误处理要友好**
```typescript
// ✅ 好的做法
if (error.canUseFallback) {
  console.log('使用降级方案');
  return fallbackData;
}

// ❌ 不好的做法
if (error.code === 401) {
  throw error; // 没有区分类型，用户体验差
}
```

### 4. **登录引导要清晰**
```typescript
if (error.requireLogin) {
  showToast({
    message: '请先登录',
    action: '去登录',
    onPress: () => router.push('/auth/login'),
  });
}
```

---

## 🚀 后续优化

### **短期（本周）**
- [x] 前端白名单机制
- [ ] 统一错误处理Hook：`useApiRequest()`
- [ ] 登录引导弹窗组件：`<LoginModal />`

### **中期（下周）**
- [ ] 后端添加 `@Anonymous` 注解支持
- [ ] 前端白名单逐步迁移到后端
- [ ] 监控降级方案使用率

### **长期（下个月）**
- [ ] 完全移除前端白名单，依赖后端配置
- [ ] 实现智能预加载（登录用户提前加载数据）
- [ ] 离线缓存策略

---

## 📞 需要帮助？

遇到问题请检查：
1. 白名单配置是否正确：`services/api/whitelist.ts`
2. 错误处理是否完整：检查 `error.canUseFallback` 和 `error.requireLogin`
3. 后端API是否返回401：查看网络请求日志

如有疑问，请联系架构团队 🙋


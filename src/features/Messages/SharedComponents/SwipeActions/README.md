# SwipeActions - 滑动操作组件

列表项滑动显示操作按钮（删除、置顶等）。

**注意**：当前为简化版本，完整实现需要集成 react-native-gesture-handler。

## 使用

```typescript
<SwipeActions
  rightActions={[
    { text: '删除', color: '#EF4444', onPress: handleDelete }
  ]}
>
  <MessageItem {...props} />
</SwipeActions>
```

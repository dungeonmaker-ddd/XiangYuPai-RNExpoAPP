// #region 1. File Banner & TOC
/**
 * ErrorBoundary - 错误边界组件
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] State Management
 * [6] Domain Logic
 * [7] UI Components & Rendering
 * [8] Exports
 */
// #endregion

// #region 2. Imports
import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// #endregion

// #region 3. Types & Schema
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
  style?: any;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
}
// #endregion

// #region 4. Constants & Config
const MAX_RETRY_COUNT = 3;
const ERROR_REPORT_TIMEOUT = 5000;

const DEFAULT_ERROR_MESSAGES = {
  GENERIC: '抱歉，应用遇到了问题',
  NETWORK: '网络连接异常，请检查网络设置',
  RENDER: '页面渲染失败，请重试',
  UNKNOWN: '未知错误，请联系客服',
} as const;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// #endregion

// #region 5. Utils & Helpers
/**
 * 生成错误ID
 */
const generateErrorId = (): string => {
  return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 格式化错误信息
 */
const formatErrorMessage = (error: Error): string => {
  if (error.message.includes('Network')) {
    return DEFAULT_ERROR_MESSAGES.NETWORK;
  }
  if (error.message.includes('render') || error.name === 'RenderError') {
    return DEFAULT_ERROR_MESSAGES.RENDER;
  }
  return error.message || DEFAULT_ERROR_MESSAGES.UNKNOWN;
};

/**
 * 获取错误堆栈摘要
 */
const getErrorSummary = (error: Error, errorInfo: ErrorInfo): string => {
  const stack = error.stack || '';
  const componentStack = errorInfo.componentStack || '';
  
  // 提取关键信息
  const errorLocation = stack.split('\n')[1] || '';
  const componentName = componentStack.split('\n')[1] || '';
  
  return `${error.name}: ${error.message}\nLocation: ${errorLocation}\nComponent: ${componentName}`;
};

/**
 * 检查是否应该重置错误状态
 */
const shouldResetError = (
  prevProps: ErrorBoundaryProps,
  nextProps: ErrorBoundaryProps
): boolean => {
  if (!nextProps.resetOnPropsChange) return false;
  
  if (nextProps.resetKeys) {
    return nextProps.resetKeys.some((key, index) => 
      prevProps.resetKeys?.[index] !== key
    );
  }
  
  return false;
};
// #endregion

// #region 6. State Management & Domain Logic
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimer: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: generateErrorId(),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 更新错误信息到状态
    this.setState({
      errorInfo,
    });

    // 调用错误回调
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 上报错误（异步，不阻塞UI）
    this.reportError(error, errorInfo);

    // 开发环境下打印详细错误信息
    if (__DEV__) {
      console.group('🚨 ErrorBoundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Error Summary:', getErrorSummary(error, errorInfo));
      console.groupEnd();
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { hasError } = this.state;
    
    if (hasError && shouldResetError(prevProps, this.props)) {
      this.resetError();
    }
  }

  componentWillUnmount() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
  }

  /**
   * 上报错误到服务器
   */
  private reportError = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      const errorReport = {
        errorId: this.state.errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        platform: Platform.OS,
        version: Platform.Version,
        // 可以添加更多上下文信息
        userAgent: Platform.constants?.reactNativeVersion,
        screenSize: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
      };

      // TODO: 集成实际的错误上报服务
      console.log('错误上报:', errorReport);
      
      // 模拟上报延迟
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (reportError) {
      console.warn('错误上报失败:', reportError);
    }
  };

  /**
   * 重试功能
   */
  private handleRetry = () => {
    const { retryCount } = this.state;
    
    if (retryCount >= MAX_RETRY_COUNT) {
      Alert.alert(
        '重试次数过多',
        '页面遇到了持续性问题，请重启应用或联系客服',
        [
          { text: '确定', style: 'default' },
          { 
            text: '联系客服', 
            style: 'default',
            onPress: () => {
              // TODO: 跳转到客服页面或打开客服聊天
              console.log('联系客服');
            }
          },
        ]
      );
      return;
    }

    this.setState(prevState => ({
      retryCount: prevState.retryCount + 1,
    }));

    // 延迟重置错误状态，给用户一些反馈
    this.retryTimer = setTimeout(() => {
      this.resetError();
    }, 500);
  };

  /**
   * 重置错误状态
   */
  private resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });
  };

  /**
   * 显示错误详情
   */
  private showErrorDetails = () => {
    const { error, errorInfo } = this.state;
    if (!error || !errorInfo) return;

    const errorSummary = getErrorSummary(error, errorInfo);
    
    Alert.alert(
      '错误详情',
      errorSummary,
      [
        { text: '复制', onPress: () => {
          // TODO: 复制错误信息到剪贴板
          console.log('复制错误信息');
        }},
        { text: '关闭', style: 'cancel' },
      ]
    );
  };

  render() {
    const { hasError, error, retryCount } = this.state;
    const { children, fallback, style } = this.props;

    if (hasError && error) {
      // 如果提供了自定义fallback，使用它
      if (fallback) {
        return fallback(error, this.state.errorInfo!, this.handleRetry);
      }

      // 使用默认错误UI
      return (
        <DefaultErrorFallback
          error={error}
          retryCount={retryCount}
          onRetry={this.handleRetry}
          onShowDetails={this.showErrorDetails}
          style={style}
        />
      );
    }

    return children;
  }
}
// #endregion

// #region 7. UI Components & Rendering
/**
 * 默认错误回退组件
 */
const DefaultErrorFallback: React.FC<{
  error: Error;
  retryCount: number;
  onRetry: () => void;
  onShowDetails: () => void;
  style?: any;
}> = ({ error, retryCount, onRetry, onShowDetails, style }) => {
  // 这里无法使用hooks，所以使用静态样式
  const styles = createStyles();

  return (
    <View style={[styles.container, style]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 错误图标 */}
        <View style={styles.iconContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
        </View>

        {/* 错误标题 */}
        <Text style={styles.title}>
          {formatErrorMessage(error)}
        </Text>

        {/* 错误描述 */}
        <Text style={styles.description}>
          我们正在努力修复这个问题。您可以尝试重新加载页面，或者稍后再试。
        </Text>

        {/* 重试信息 */}
        {retryCount > 0 && (
          <Text style={styles.retryInfo}>
            已重试 {retryCount} 次
          </Text>
        )}

        {/* 操作按钮 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={onRetry}
            disabled={retryCount >= MAX_RETRY_COUNT}
          >
            <Text style={[styles.buttonText, styles.primaryButtonText]}>
              {retryCount >= MAX_RETRY_COUNT ? '重试已达上限' : '重试'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={onShowDetails}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              查看详情
            </Text>
          </TouchableOpacity>
        </View>

        {/* 开发环境错误信息 */}
        {__DEV__ && (
          <View style={styles.devInfo}>
            <Text style={styles.devTitle}>开发环境错误信息：</Text>
            <Text style={styles.devError}>{error.message}</Text>
            <Text style={styles.devStack}>{error.stack}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

/**
 * 创建样式
 */
const createStyles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    minHeight: SCREEN_HEIGHT * 0.6,
  },
  iconContainer: {
    marginBottom: 24,
  },
  errorIcon: {
    fontSize: 64,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 28,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    maxWidth: SCREEN_WIDTH * 0.8,
  },
  retryInfo: {
    fontSize: 14,
    color: '#F59E0B',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 280,
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#6366F1',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#374151',
  },
  devInfo: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    width: '100%',
  },
  devTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 8,
  },
  devError: {
    fontSize: 12,
    color: '#991B1B',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  devStack: {
    fontSize: 10,
    color: '#7F1D1D',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 14,
  },
});
// #endregion

// #region 8. Exports
export default ErrorBoundary;

// 便捷的HOC包装器
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// 导出类型
export type { ErrorBoundaryProps, ErrorBoundaryState };
// #endregion

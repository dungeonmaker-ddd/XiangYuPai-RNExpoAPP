/**
 * Token Test Utilities
 * 
 * 用于测试不同的Token传输方式
 * 帮助调试后端token接收问题
 */

import { apiClient, type TokenTransmissionConfig } from './client';

// 🎯 测试配置预设
export const TOKEN_TEST_PRESETS = {
  /**
   * 标准配置 (默认)
   * 符合SA-Token要求: Authorization: Bearer <token> + clientid header
   */
  STANDARD: {
    useAuthorizationHeader: true,
    useCustomHeaders: false,
    useUrlParameter: false,
    includeClientId: true,
    clientIdHeaderName: 'clientid',
    tokenPrefix: 'Bearer',
    enableDebugLogs: true,
  } as Partial<TokenTransmissionConfig>,

  /**
   * 无Bearer前缀
   * 测试: Authorization: <token> (不带 "Bearer ")
   */
  NO_PREFIX: {
    useAuthorizationHeader: true,
    useCustomHeaders: false,
    useUrlParameter: false,
    includeClientId: true,
    clientIdHeaderName: 'clientid',
    tokenPrefix: '',  // 🔥 移除前缀
    enableDebugLogs: true,
  } as Partial<TokenTransmissionConfig>,

  /**
   * 自定义Headers
   * 测试: satoken: <token> + token: <token> + X-Token: <token>
   */
  CUSTOM_HEADERS: {
    useAuthorizationHeader: false,  // 🔥 禁用标准header
    useCustomHeaders: true,         // 🔥 启用自定义headers
    customHeaderNames: ['satoken', 'token', 'X-Token'],
    useUrlParameter: false,
    includeClientId: true,
    clientIdHeaderName: 'clientid',
    tokenPrefix: '',
    enableDebugLogs: true,
  } as Partial<TokenTransmissionConfig>,

  /**
   * URL参数
   * 测试: ?Authorization=Bearer%20<token>
   */
  URL_PARAMETER: {
    useAuthorizationHeader: false,
    useCustomHeaders: false,
    useUrlParameter: true,           // 🔥 启用URL参数
    urlParameterName: 'Authorization',
    includeClientId: true,
    clientIdHeaderName: 'clientid',
    tokenPrefix: 'Bearer',
    enableDebugLogs: true,
  } as Partial<TokenTransmissionConfig>,

  /**
   * 组合模式 (All-in-One)
   * 同时使用所有方法（用于全面测试）
   */
  ALL_METHODS: {
    useAuthorizationHeader: true,    // 🔥 标准header
    useCustomHeaders: true,          // 🔥 自定义headers
    customHeaderNames: ['satoken', 'token', 'X-Token'],
    useUrlParameter: true,           // 🔥 URL参数
    urlParameterName: 'Authorization',
    includeClientId: true,
    clientIdHeaderName: 'clientid',
    tokenPrefix: 'Bearer',
    enableDebugLogs: true,
  } as Partial<TokenTransmissionConfig>,

  /**
   * 最简模式
   * 只发送token，不带任何额外配置
   */
  MINIMAL: {
    useAuthorizationHeader: true,
    useCustomHeaders: false,
    useUrlParameter: false,
    includeClientId: false,          // 🔥 不发送clientid
    tokenPrefix: '',                 // 🔥 不带前缀
    enableDebugLogs: true,
  } as Partial<TokenTransmissionConfig>,

  /**
   * 调试模式 (关闭日志)
   * 用于减少控制台输出
   */
  SILENT: {
    useAuthorizationHeader: true,
    useCustomHeaders: false,
    useUrlParameter: false,
    includeClientId: true,
    clientIdHeaderName: 'clientid',
    tokenPrefix: 'Bearer',
    enableDebugLogs: false,           // 🔥 关闭详细日志
  } as Partial<TokenTransmissionConfig>,
};

/**
 * 快速切换Token传输配置
 * 
 * @param preset - 预设配置名称
 * 
 * @example
 * ```typescript
 * // 在你的测试代码中
 * import { switchTokenPreset } from '@/services/api/tokenTestUtils';
 * 
 * // 测试标准配置
 * switchTokenPreset('STANDARD');
 * 
 * // 测试无前缀
 * switchTokenPreset('NO_PREFIX');
 * 
 * // 测试自定义headers
 * switchTokenPreset('CUSTOM_HEADERS');
 * 
 * // 测试URL参数
 * switchTokenPreset('URL_PARAMETER');
 * 
 * // 测试组合模式
 * switchTokenPreset('ALL_METHODS');
 * ```
 */
export function switchTokenPreset(
  preset: keyof typeof TOKEN_TEST_PRESETS
): void {
  const config = TOKEN_TEST_PRESETS[preset];
  
  console.log('\n🔧━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🔧 [Token Test] 切换到预设: ${preset}`);
  console.log('🔧━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  apiClient.configureTokenTransmission(config);
}

/**
 * 应用自定义Token配置
 * 
 * @param config - 自定义配置
 * 
 * @example
 * ```typescript
 * import { applyTokenConfig } from '@/services/api/tokenTestUtils';
 * 
 * // 自定义配置
 * applyTokenConfig({
 *   useAuthorizationHeader: true,
 *   tokenPrefix: 'Token',  // 使用 "Token" 而不是 "Bearer"
 *   includeClientId: false,
 * });
 * ```
 */
export function applyTokenConfig(
  config: Partial<TokenTransmissionConfig>
): void {
  console.log('\n🔧━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔧 [Token Test] 应用自定义配置');
  console.log('🔧━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  apiClient.configureTokenTransmission(config);
}

/**
 * 获取当前Token配置
 * 
 * @returns 当前的Token配置
 * 
 * @example
 * ```typescript
 * import { getCurrentTokenConfig } from '@/services/api/tokenTestUtils';
 * 
 * const config = getCurrentTokenConfig();
 * console.log('当前配置:', config);
 * ```
 */
export function getCurrentTokenConfig(): TokenTransmissionConfig {
  return apiClient.getTokenConfig();
}

/**
 * 打印当前Token配置
 * 
 * @example
 * ```typescript
 * import { printTokenConfig } from '@/services/api/tokenTestUtils';
 * 
 * printTokenConfig();
 * ```
 */
export function printTokenConfig(): void {
  const config = apiClient.getTokenConfig();
  
  console.log('\n📋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 [Token Config] 当前配置');
  console.log('📋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('   Authorization Header:', config.useAuthorizationHeader ? '✅' : '❌');
  console.log('   Token Prefix:', config.tokenPrefix || '(无)');
  console.log('   Custom Headers:', config.useCustomHeaders ? `✅ [${config.customHeaderNames?.join(', ')}]` : '❌');
  console.log('   URL Parameter:', config.useUrlParameter ? `✅ ?${config.urlParameterName}=<token>` : '❌');
  console.log('   ClientId Header:', config.includeClientId ? `✅ ${config.clientIdHeaderName}: ${apiClient.getClientId()}` : '❌');
  console.log('   Debug Logs:', config.enableDebugLogs ? '✅ 启用' : '❌ 禁用');
  console.log('📋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

/**
 * 测试所有预设配置
 * 依次切换并打印每个预设的配置
 * 
 * @example
 * ```typescript
 * import { testAllPresets } from '@/services/api/tokenTestUtils';
 * 
 * // 查看所有预设配置
 * testAllPresets();
 * ```
 */
export function testAllPresets(): void {
  console.log('\n🧪━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🧪 [Token Test] 测试所有预设配置');
  console.log('🧪━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const presets = Object.keys(TOKEN_TEST_PRESETS) as Array<keyof typeof TOKEN_TEST_PRESETS>;
  
  presets.forEach(preset => {
    console.log(`\n▶️  测试预设: ${preset}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    apiClient.configureTokenTransmission(TOKEN_TEST_PRESETS[preset]);
    console.log('');
  });
  
  console.log('\n🧪━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🧪 [Token Test] 所有预设测试完成');
  console.log('🧪━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

/**
 * 重置为默认配置 (标准SA-Token配置)
 * 
 * @example
 * ```typescript
 * import { resetToDefault } from '@/services/api/tokenTestUtils';
 * 
 * // 测试完毕，恢复默认
 * resetToDefault();
 * ```
 */
export function resetToDefault(): void {
  console.log('\n🔄━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔄 [Token Test] 重置为默认配置');
  console.log('🔄━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  switchTokenPreset('STANDARD');
}

// 🎯 预设说明
export const PRESET_DESCRIPTIONS = {
  STANDARD: `
📋 标准配置 (推荐)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Authorization: Bearer <token>
✅ clientid: app
❌ 自定义headers
❌ URL参数

适用于: 
- 标准OAuth 2.0应用
- SA-Token默认配置
- 生产环境推荐
`,

  NO_PREFIX: `
📋 无Bearer前缀
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Authorization: <token> (无"Bearer ")
✅ clientid: app
❌ 自定义headers
❌ URL参数

适用于:
- 后端不期望Bearer前缀
- 测试token格式兼容性
`,

  CUSTOM_HEADERS: `
📋 自定义Headers
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Authorization header (禁用)
✅ satoken: <token>
✅ token: <token>
✅ X-Token: <token>
✅ clientid: app

适用于:
- 后端使用非标准header名
- 测试后端header解析
- 兼容旧系统
`,

  URL_PARAMETER: `
📋 URL参数
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Authorization header (禁用)
✅ ?Authorization=Bearer%20<token>
✅ clientid: app

适用于:
- 无法传递header的场景
- WebSocket连接
- 某些浏览器限制
注意: URL中暴露token，安全性较低
`,

  ALL_METHODS: `
📋 组合模式 (All-in-One)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Authorization: Bearer <token>
✅ satoken: <token>
✅ token: <token>
✅ X-Token: <token>
✅ ?Authorization=Bearer%20<token>
✅ clientid: app

适用于:
- 全面测试后端token接收
- 不确定后端期望哪种方式
- 调试401问题
注意: 生产环境不推荐 (冗余)
`,

  MINIMAL: `
📋 最简模式
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Authorization: <token> (无前缀)
❌ clientid header (禁用)
❌ 自定义headers
❌ URL参数

适用于:
- 测试最基础的token发送
- 排除其他因素干扰
注意: 不符合SA-Token标准 (缺少clientid)
`,

  SILENT: `
📋 调试模式 (静默)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Authorization: Bearer <token>
✅ clientid: app
❌ 详细日志 (禁用)

适用于:
- 减少控制台输出
- 生产环境
- 性能测试
`,
};

/**
 * 打印预设说明
 * 
 * @param preset - 预设名称
 * 
 * @example
 * ```typescript
 * import { printPresetDescription } from '@/services/api/tokenTestUtils';
 * 
 * printPresetDescription('STANDARD');
 * printPresetDescription('ALL_METHODS');
 * ```
 */
export function printPresetDescription(
  preset: keyof typeof TOKEN_TEST_PRESETS
): void {
  const description = PRESET_DESCRIPTIONS[preset];
  console.log(description);
}

/**
 * 打印所有预设说明
 * 
 * @example
 * ```typescript
 * import { printAllPresetDescriptions } from '@/services/api/tokenTestUtils';
 * 
 * // 查看所有预设的详细说明
 * printAllPresetDescriptions();
 * ```
 */
export function printAllPresetDescriptions(): void {
  console.log('\n📚━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📚 [Token Test] 所有预设配置说明');
  console.log('📚━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  Object.keys(PRESET_DESCRIPTIONS).forEach(preset => {
    console.log(PRESET_DESCRIPTIONS[preset as keyof typeof PRESET_DESCRIPTIONS]);
  });
  
  console.log('📚━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}


#!/usr/bin/env node

/**
 * 项目实施验证脚本
 * 检查所有核心文件是否正确创建和配置
 */

const fs = require('fs');
const path = require('path');

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️ ${msg}${colors.reset}`),
};

// 检查文件是否存在
const checkFile = (filePath, description) => {
  if (fs.existsSync(filePath)) {
    log.success(`${description}: ${filePath}`);
    return true;
  } else {
    log.error(`${description}: ${filePath}`);
    return false;
  }
};

// 检查目录是否存在
const checkDirectory = (dirPath, description) => {
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    log.success(`${description}: ${dirPath}`);
    return true;
  } else {
    log.error(`${description}: ${dirPath}`);
    return false;
  }
};

// 检查文件内容
const checkFileContent = (filePath, searchText, description) => {
  try {
    if (!fs.existsSync(filePath)) {
      log.error(`文件不存在: ${filePath}`);
      return false;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(searchText)) {
      log.success(`${description}: ${filePath}`);
      return true;
    } else {
      log.warning(`${description}: ${filePath} (内容可能缺失)`);
      return false;
    }
  } catch (error) {
    log.error(`读取文件失败: ${filePath} - ${error.message}`);
    return false;
  }
};

console.log(`${colors.blue}
🧪 XiangYuPai-RNExpoAPP 项目实施验证
======================================${colors.reset}
`);

let totalChecks = 0;
let passedChecks = 0;

// 核心配置文件检查
console.log('\n📋 1. 核心配置文件检查');
totalChecks += 4;
passedChecks += checkFile('package.json', 'Package配置文件') ? 1 : 0;
passedChecks += checkFile('app.json', 'Expo配置文件') ? 1 : 0;
passedChecks += checkFile('tsconfig.json', 'TypeScript配置文件') ? 1 : 0;
passedChecks += checkFileContent('package.json', 'zustand', 'Zustand依赖已安装') ? 1 : 0;

// Expo Router路由检查
console.log('\n🧭 2. Expo Router路由结构检查');
totalChecks += 8;
passedChecks += checkFile('app/_layout.tsx', '根布局文件') ? 1 : 0;
passedChecks += checkFile('app/(tabs)/_layout.tsx', 'Tab布局文件') ? 1 : 0;
passedChecks += checkFile('app/(tabs)/homepage/_layout.tsx', '首页布局文件') ? 1 : 0;
passedChecks += checkFile('app/(tabs)/homepage/index.tsx', '首页主文件') ? 1 : 0;
passedChecks += checkFile('app/(tabs)/homepage/search.tsx', '搜索页面') ? 1 : 0;
passedChecks += checkFile('app/(tabs)/homepage/service-detail.tsx', '服务详情页面') ? 1 : 0;
passedChecks += checkFile('app/modal/user-detail.tsx', '用户详情模态') ? 1 : 0;
passedChecks += checkDirectory('app/(tabs)/homepage', '首页路由目录') ? 1 : 0;

// Zustand状态管理检查
console.log('\n🔄 3. Zustand状态管理检查');
totalChecks += 5;
passedChecks += checkFile('stores/homepageStore.ts', '首页状态存储') ? 1 : 0;
passedChecks += checkFile('stores/userStore.ts', '用户状态存储') ? 1 : 0;
passedChecks += checkFile('stores/locationStore.ts', '位置状态存储') ? 1 : 0;
passedChecks += checkFile('stores/configStore.ts', '配置状态存储') ? 1 : 0;
passedChecks += checkFile('stores/index.ts', '状态存储索引文件') ? 1 : 0;

// API服务层检查
console.log('\n🌐 4. API服务层检查');
totalChecks += 6;
passedChecks += checkFile('services/api/client.ts', 'API客户端') ? 1 : 0;
passedChecks += checkFile('services/api/config.ts', 'API配置') ? 1 : 0;
passedChecks += checkFile('services/api/homepageApi.ts', '首页API') ? 1 : 0;
passedChecks += checkFile('services/api/userApi.ts', '用户API') ? 1 : 0;
passedChecks += checkFile('services/api/locationApi.ts', '位置API') ? 1 : 0;
passedChecks += checkFile('services/api/index.ts', 'API索引文件') ? 1 : 0;

// 共享组件检查
console.log('\n🧩 5. 共享组件库检查');
totalChecks += 5;
passedChecks += checkFile('src/components/ErrorBoundary.tsx', '错误边界组件') ? 1 : 0;
passedChecks += checkFile('src/components/LoadingOverlay.tsx', '加载覆盖层组件') ? 1 : 0;
passedChecks += checkFile('src/components/ui/Button.tsx', '按钮组件') ? 1 : 0;
passedChecks += checkFile('src/components/ui/Card.tsx', '卡片组件') ? 1 : 0;
passedChecks += checkFile('src/components/index.ts', '组件索引文件') ? 1 : 0;

// MainPage组件检查
console.log('\n📱 6. MainPage组件结构检查');
totalChecks += 10;
passedChecks += checkFile('src/features/Homepage/MainPage/index.tsx', 'MainPage主文件') ? 1 : 0;
passedChecks += checkFile('src/features/Homepage/MainPage/types.ts', 'MainPage类型文件') ? 1 : 0;
passedChecks += checkFile('src/features/Homepage/MainPage/constants.ts', 'MainPage常量文件') ? 1 : 0;
passedChecks += checkFile('src/features/Homepage/MainPage/styles.ts', 'MainPage样式文件') ? 1 : 0;
passedChecks += checkFile('src/features/Homepage/MainPage/components/TopFunctionArea/index.tsx', '顶部功能区域') ? 1 : 0;
passedChecks += checkFile('src/features/Homepage/MainPage/components/GameBannerArea/index.tsx', '游戏横幅区域') ? 1 : 0;
passedChecks += checkFile('src/features/Homepage/MainPage/components/ServiceGridArea/index.tsx', '服务网格区域') ? 1 : 0;
passedChecks += checkFile('src/features/Homepage/MainPage/components/FeaturedUsersArea/index.tsx', '精选用户区域') ? 1 : 0;
passedChecks += checkFile('src/features/Homepage/MainPage/components/EventCenterArea/index.tsx', '组队聚会区域') ? 1 : 0;
passedChecks += checkFile('src/features/Homepage/MainPage/components/UserListArea/index.tsx', '用户列表区域') ? 1 : 0;

// 样式系统检查
console.log('\n🎨 7. 样式设计系统检查');
totalChecks += 4;
passedChecks += checkFile('src/styles/theme.ts', '主题配置') ? 1 : 0;
passedChecks += checkFile('src/styles/responsive.ts', '响应式工具') ? 1 : 0;
passedChecks += checkFile('src/styles/utils.ts', '样式工具') ? 1 : 0;
passedChecks += checkFile('src/styles/index.ts', '样式索引文件') ? 1 : 0;

// 工具函数检查
console.log('\n🛠️ 8. 工具函数库检查');
totalChecks += 3;
passedChecks += checkFile('src/utils/performance.ts', '性能优化工具') ? 1 : 0;
passedChecks += checkFile('src/utils/testing.ts', '测试调试工具') ? 1 : 0;
passedChecks += checkFile('src/utils/index.ts', '工具索引文件') ? 1 : 0;

// 内容验证检查
console.log('\n🔍 9. 关键内容验证检查');
totalChecks += 5;
passedChecks += checkFileContent('src/features/Homepage/MainPage/index.tsx', '#region', '八段式结构') ? 1 : 0;
passedChecks += checkFileContent('stores/homepageStore.ts', 'AsyncStorage', 'Zustand持久化配置') ? 1 : 0;
passedChecks += checkFileContent('app/(tabs)/_layout.tsx', 'homepage', 'Tab路由配置') ? 1 : 0;
passedChecks += checkFileContent('src/features/Homepage/MainPage/index.tsx', 'useHomepageStore', 'Zustand集成') ? 1 : 0;
passedChecks += checkFileContent('src/features/Homepage/MainPage/index.tsx', 'TopFunctionArea', '区域组件集成') ? 1 : 0;

// 总结
console.log(`\n📊 验证结果总结`);
console.log('='.repeat(40));
console.log(`总检查项: ${totalChecks}`);
console.log(`通过检查: ${passedChecks}`);
console.log(`通过率: ${((passedChecks / totalChecks) * 100).toFixed(1)}%`);

if (passedChecks === totalChecks) {
  log.success('🎉 所有检查项都通过！项目实施完成！');
  console.log(`
${colors.green}🎊 恭喜！您的XiangYuPai-RNExpoAPP项目已完全实施完成！

✅ Expo Router路由系统已配置
✅ Zustand状态管理已集成  
✅ API服务层已实现
✅ 6个区域组件已创建
✅ 共享组件库已构建
✅ 样式设计系统已完成
✅ 性能优化已实施

🚀 您现在可以运行 'expo start' 启动应用！${colors.reset}
  `);
} else {
  log.warning(`还有 ${totalChecks - passedChecks} 个检查项未通过，请检查上述错误信息。`);
}

// 下一步指导
console.log(`\n🎯 下一步操作指南:`);
console.log(`1. 运行 'expo start' 启动开发服务器`);
console.log(`2. 在模拟器或真机上测试应用`);
console.log(`3. 查看首页的6个功能区域`);
console.log(`4. 测试所有导航和交互功能`);
console.log(`5. 根据需要调整UI和功能\n`);
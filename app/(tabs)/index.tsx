/**
 * Default Tab Route - 重定向到首页
 */

import { Redirect } from 'expo-router';

export default function DefaultTabScreen() {
  return <Redirect href="/(tabs)/homepage" />;
}

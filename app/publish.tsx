/**
 * Publish Page - 发布动态页面
 * 
 * 功能：
 * - 标题输入
 * - 正文编辑器
 * - 媒体上传（图片/视频）
 * - 话题选择
 * - 地点选择
 * - 发布按钮
 */

import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// 颜色常量
const COLORS = {
  PRIMARY: '#8A2BE2',
  BACKGROUND: '#F5F5F5',
  CARD_BACKGROUND: '#FFFFFF',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#666666',
  TEXT_TERTIARY: '#999999',
  BORDER: '#E5E5E5',
  DISABLED: '#CCCCCC',
} as const;

export default function PublishPage() {
  const router = useRouter();
  
  // 表单状态
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  // 选择图片
  const pickImages = async () => {
    if (images.length >= 9) {
      Alert.alert('提示', '最多只能选择9张图片');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages(prev => [...prev, ...newImages].slice(0, 9));
    }
  };

  // 移除图片
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // 添加话题
  const addTopic = () => {
    // TODO: 打开话题选择器
    Alert.alert('提示', '话题选择功能开发中...');
  };

  // 选择地点
  const selectLocation = () => {
    // TODO: 打开地点选择器
    Alert.alert('提示', '地点选择功能开发中...');
  };

  // 发布动态
  const handlePublish = async () => {
    if (!content.trim()) {
      Alert.alert('提示', '请输入动态内容');
      return;
    }

    setIsPublishing(true);
    try {
      // TODO: 调用发布API
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用
      Alert.alert('成功', '发布成功！', [
        { text: '确定', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('错误', '发布失败，请重试');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={isPublishing}
        >
          <Text style={styles.backButtonText}>取消</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>发布动态</Text>
        <TouchableOpacity 
          style={[
            styles.publishButton,
            (!content.trim() || isPublishing) && styles.publishButtonDisabled
          ]}
          onPress={handlePublish}
          disabled={!content.trim() || isPublishing}
        >
          <Text style={[
            styles.publishButtonText,
            (!content.trim() || isPublishing) && styles.publishButtonTextDisabled
          ]}>
            {isPublishing ? '发布中...' : '发布'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* 标题输入（可选） */}
        <View style={styles.section}>
          <TextInput
            style={styles.titleInput}
            placeholder="添加标题（可选）"
            placeholderTextColor={COLORS.TEXT_TERTIARY}
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />
        </View>

        {/* 正文输入 */}
        <View style={styles.section}>
          <TextInput
            style={styles.contentInput}
            placeholder="分享你的精彩瞬间..."
            placeholderTextColor={COLORS.TEXT_TERTIARY}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            maxLength={5000}
          />
          <Text style={styles.charCount}>{content.length}/5000</Text>
        </View>

        {/* 图片网格 */}
        {images.length > 0 && (
          <View style={styles.section}>
            <View style={styles.imageGrid}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  <TouchableOpacity 
                    style={styles.imageRemoveButton}
                    onPress={() => removeImage(index)}
                  >
                    <Text style={styles.imageRemoveText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 话题标签 */}
        {selectedTopics.length > 0 && (
          <View style={styles.section}>
            <View style={styles.topicList}>
              {selectedTopics.map((topic, index) => (
                <View key={index} style={styles.topicTag}>
                  <Text style={styles.topicText}>#{topic}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 地点标签 */}
        {location && (
          <View style={styles.section}>
            <View style={styles.locationTag}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText}>{location}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* 底部工具栏 */}
      <View style={styles.toolbar}>
        <TouchableOpacity 
          style={styles.toolButton}
          onPress={pickImages}
        >
          <Text style={styles.toolIcon}>🖼️</Text>
          <Text style={styles.toolText}>图片</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.toolButton}
          onPress={addTopic}
        >
          <Text style={styles.toolIcon}>#️⃣</Text>
          <Text style={styles.toolText}>话题</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.toolButton}
          onPress={selectLocation}
        >
          <Text style={styles.toolIcon}>📍</Text>
          <Text style={styles.toolText}>地点</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 16,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  publishButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  publishButtonDisabled: {
    backgroundColor: COLORS.DISABLED,
  },
  publishButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  publishButtonTextDisabled: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  titleInput: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  contentInput: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    minHeight: 150,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.TEXT_TERTIARY,
    textAlign: 'right',
    marginTop: 8,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imageWrapper: {
    width: '31%',
    aspectRatio: 1,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: COLORS.BORDER,
  },
  imageRemoveButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageRemoveText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  topicList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicTag: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  topicText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 8,
    padding: 12,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  locationText: {
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 12,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  toolButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  toolIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  toolText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
});

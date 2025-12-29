/**
 * CreateProject - Project creation screen with design system
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { ProjectsStackParamList } from '../navigation/types';
import { Colors, Spacing, Typography, TouchTargets, BorderRadius } from '../design-system';
import { MineButton, MineInput, MineCard } from '../components';
import { ProjectService } from '../services/ProjectService';

type Props = StackScreenProps<ProjectsStackParamList, 'CreateProject'>;

type ProjectType = 'timeline' | 'freestyle';

export function CreateProject({ navigation }: Props) {
  const [projectName, setProjectName] = useState('');
  const [selectedType, setSelectedType] = useState<ProjectType>('timeline');
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');

  const projectService = ProjectService.getInstance();

  const validateProjectName = (name: string): boolean => {
    if (!name.trim()) {
      setNameError('Project name is required');
      return false;
    }
    if (name.trim().length < 2) {
      setNameError('Project name must be at least 2 characters');
      return false;
    }
    if (name.trim().length > 50) {
      setNameError('Project name must be less than 50 characters');
      return false;
    }
    setNameError('');
    return true;
  };

  const handleProjectTypeSelect = async (type: ProjectType) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedType(type);
  };

  const handleCreateProject = async () => {
    if (!validateProjectName(projectName)) {
      return;
    }

    try {
      setLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const project = await projectService.createProject(selectedType, projectName.trim());
      
      // Navigate to the new project
      navigation.replace('ProjectDetail', { projectId: project.id });
      
    } catch (error) {
      console.error('Failed to create project:', error);
      Alert.alert('Error', 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderProjectTypeCard = (
    type: ProjectType,
    title: string,
    description: string,
    icon: keyof typeof Ionicons.glyphMap,
    color: string
  ) => {
    const cardStyle: any[] = [styles.typeCard];
    if (selectedType === type) {
      cardStyle.push({ borderColor: color, borderWidth: 2 });
    }
    
    return (
      <MineCard
        onPress={() => handleProjectTypeSelect(type)}
        style={cardStyle as any}
      >
      <View style={styles.typeHeader}>
        <View style={[styles.typeIcon, { backgroundColor: color }]}>
          <Ionicons name={icon} size={24} color={Colors.white} />
        </View>
        <View style={styles.typeInfo}>
          <Text style={styles.typeTitle}>{title}</Text>
          <Text style={styles.typeDescription}>{description}</Text>
        </View>
        {selectedType === type && (
          <Ionicons name="checkmark-circle" size={24} color={color} />
        )}
      </View>
    </MineCard>
  );
};

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Create Project</Text>
        
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Project Name Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Name</Text>
          <MineInput
            value={projectName}
            onChangeText={(text) => {
              setProjectName(text);
              if (nameError) validateProjectName(text);
            }}
            placeholder="Enter project name..."
            error={nameError}
            maxLength={50}
            style={styles.nameInput}
          />
        </View>

        {/* Project Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Type</Text>
          <Text style={styles.sectionDescription}>
            Choose how you want to organize your video clips
          </Text>
          
          <View style={styles.typeCards}>
            {renderProjectTypeCard(
              'timeline',
              'Timeline Project',
              'Organize videos by calendar date. Perfect for daily journaling and tracking progress over time.',
              'calendar',
              Colors.sage
            )}
            
            {renderProjectTypeCard(
              'freestyle',
              'Freestyle Project',
              'Organize videos manually in any order. Great for themed collections and creative projects.',
              'albums',
              Colors.lavender
            )}
          </View>
        </View>

        {/* Features Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What you can do</Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="videocam" size={20} color={Colors.sage} />
              <Text style={styles.featureText}>Capture 1-3 second video moments</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="film" size={20} color={Colors.sage} />
              <Text style={styles.featureText}>Compile videos into cinematic timelines</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="document-text" size={20} color={Colors.sage} />
              <Text style={styles.featureText}>Add notes and memories to each clip</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="share" size={20} color={Colors.sage} />
              <Text style={styles.featureText}>Export and share your completed projects</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Create Button */}
      <View style={styles.footer}>
        <MineButton
          onPress={handleCreateProject}
          loading={loading}
          disabled={!projectName.trim() || !!nameError}
          style={styles.createButton}
        >
          Create Project
        </MineButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: TouchTargets.minimum,
    height: TouchTargets.minimum,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: TouchTargets.minimum,
  },
  
  // Content
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  
  // Sections
  section: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  sectionDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 21,
  },
  
  // Name Input
  nameInput: {
    marginBottom: 0,
  },
  
  // Type Cards
  typeCards: {
    gap: Spacing.md,
  },
  typeCard: {
    marginBottom: 0,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  typeInfo: {
    flex: 1,
  },
  typeTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  typeDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  
  // Features List
  featuresList: {
    gap: Spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featureText: {
    ...Typography.body,
    color: Colors.textSecondary,
    flex: 1,
  },
  
  // Footer
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  createButton: {
    width: '100%',
  },
});
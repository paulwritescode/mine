/**
 * ProjectHeader - Project management header with controls
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useFonts, NanumPenScript_400Regular } from '@expo-google-fonts/nanum-pen-script';

import { Colors, Spacing, Typography, BorderRadius, TouchTargets } from '../design-system';
import { Project } from '../types';

export interface ProjectHeaderProps {
  project: Project;
  onBack: () => void;
  onRename: (project: Project) => void;
  onDelete: (project: Project) => void;
  onShare: (project: Project) => void;
}

export function ProjectHeader({
  project,
  onBack,
  onRename,
  onDelete,
  onShare,
}: ProjectHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [fontsLoaded] = useFonts({
    NanumPenScript_400Regular,
  });

  const handleMenuToggle = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowMenu(!showMenu);
  };

  const handleRename = async () => {
    setShowMenu(false);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRename(project);
  };

  const handleDelete = async () => {
    setShowMenu(false);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${project.name}"? This will permanently delete all videos and cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(project),
        },
      ]
    );
  };

  const handleShare = async () => {
    setShowMenu(false);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onShare(project);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Main Header */}
      <View style={styles.mainHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        
        <View style={styles.projectInfo}>
          <Text style={styles.projectName}>{project.name}</Text>
        </View>
        
        <TouchableOpacity onPress={handleMenuToggle} style={styles.menuButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={Colors.black} />
        </TouchableOpacity>
      </View>

      {/* Dropdown Menu */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity onPress={handleRename} style={styles.menuItem}>
              <Ionicons name="pencil" size={18} color={Colors.black} />
              <Text style={styles.menuItemText}>Rename</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleShare} style={styles.menuItem}>
              <Ionicons name="share" size={18} color={Colors.black} />
              <Text style={styles.menuItemText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleDelete} style={[styles.menuItem, styles.deleteMenuItem]}>
              <Ionicons name="trash" size={18} color={Colors.error} />
              <Text style={[styles.menuItemText, styles.deleteMenuItemText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  
  // Main Header
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  backButton: {
    width: TouchTargets.minimum,
    height: TouchTargets.minimum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 32,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
    fontWeight: 'bold',
  },
  projectInfo: {
    flex: 1,
    alignItems: 'center',
  },
  projectName: {
    fontSize: 28,
    color: Colors.black,
    fontFamily: 'NanumPenScript_400Regular',
    textAlign: 'center',
  },
  menuButton: {
    width: TouchTargets.minimum,
    height: TouchTargets.minimum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Dropdown Menu
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 100, // Position below header
    paddingRight: Spacing.lg,
  },
  menuContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    minWidth: 150,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  menuItemText: {
    ...Typography.body,
    color: Colors.black,
    fontWeight: '500',
  },
  deleteMenuItem: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  deleteMenuItemText: {
    color: Colors.error,
  },
});
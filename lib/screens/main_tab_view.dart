import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'projects/projects_list_screen.dart';
import 'settings/settings_screen.dart';

class MainTabView extends StatefulWidget {
  const MainTabView({super.key});

  @override
  State<MainTabView> createState() => _MainTabViewState();
}

class _MainTabViewState extends State<MainTabView> with TickerProviderStateMixin {
  int _currentIndex = 0;
  late AnimationController _captureButtonController;
  late AnimationController _tabController;

  final List<Widget> _screens = [
    const ProjectsListScreen(),
    const SettingsScreen(),
  ];

  final List<TabItem> _tabs = [
    TabItem(
      icon: Icons.folder_outlined,
      activeIcon: Icons.folder,
      label: 'Projects',
    ),
    TabItem(
      icon: Icons.settings_outlined,
      activeIcon: Icons.settings,
      label: 'Settings',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _captureButtonController = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
    _tabController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
  }

  @override
  void dispose() {
    _captureButtonController.dispose();
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: _buildFloatingTabBar(),
      floatingActionButton: _buildCaptureButton(),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      // Removed extendBody to prevent body content from overlapping navigation
    );
  }

  Widget _buildFloatingTabBar() {
    return Container(
      height: 80 + MediaQuery.of(context).padding.bottom,
      decoration: BoxDecoration(
        color: Colors.white,
        // Removed curved borders for full width appearance
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 20,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: SafeArea(
        child: Padding(
          // Reduced horizontal padding for full width
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              // Add spacer for the floating button in the center
              _buildTabItem(0, _tabs[0]),
              const SizedBox(width: 60), // Space for floating button
              _buildTabItem(1, _tabs[1]),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTabItem(int index, TabItem tab) {
    final isActive = _currentIndex == index;
    
    return GestureDetector(
      onTap: () => _onTabTapped(index),
      child: AnimatedScale(
        scale: isActive ? 1.1 : 1.0,
        duration: const Duration(milliseconds: 200),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 200),
                child: Icon(
                  isActive ? tab.activeIcon : tab.icon,
                  key: ValueKey(isActive),
                  color: isActive ? Colors.black : Colors.grey[400],
                  size: 24,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                tab.label,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
                  color: isActive ? Colors.black : Colors.grey[400],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCaptureButton() {
    return GestureDetector(
      onTapDown: (_) {
        _captureButtonController.forward();
        HapticFeedback.mediumImpact();
      },
      onTapUp: (_) {
        _captureButtonController.reverse();
        _navigateToCreateProject();
      },
      onTapCancel: () {
        _captureButtonController.reverse();
      },
      child: AnimatedBuilder(
        animation: _captureButtonController,
        builder: (context, child) {
          final scale = 1.0 - (_captureButtonController.value * 0.1);
          return Transform.scale(
            scale: scale,
            child: Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                color: Colors.black,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.3),
                    blurRadius: 15,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              child: const Icon(
                Icons.add,
                color: Colors.white,
                size: 28,
              ),
            ),
          );
        },
      ),
    );
  }

  void _onTabTapped(int index) {
    if (_currentIndex != index) {
      HapticFeedback.selectionClick();
      setState(() {
        _currentIndex = index;
      });
    }
  }

  void _navigateToCreateProject() {
    context.push('/create-project');
  }
}

class TabItem {
  final IconData icon;
  final IconData activeIcon;
  final String label;

  TabItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
  });
}
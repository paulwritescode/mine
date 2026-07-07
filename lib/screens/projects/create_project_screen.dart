import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/projects_provider.dart';
import '../../core/models/project.dart';
import '../../core/theme/tokens.dart';

class CreateProjectScreen extends StatefulWidget {
  const CreateProjectScreen({super.key});

  @override
  State<CreateProjectScreen> createState() => _CreateProjectScreenState();
}

class _CreateProjectScreenState extends State<CreateProjectScreen>
    with TickerProviderStateMixin {
  final PageController _pageController = PageController();
  late AnimationController _slideController;
  late AnimationController _fadeController;

  int _currentStep = 0;
  final int _totalSteps = 2;

  // Step 1: Name and Label
  final _nameController = TextEditingController();
  final _labelController = TextEditingController();
  final _nameFocusNode = FocusNode();
  final _labelFocusNode = FocusNode();
  bool _nameValid = false;

  // Step 2: Project Type
  ProjectType? _selectedType;

  // Form state
  bool _isCreating = false;

  // Predefined labels
  final List<String> _suggestedLabels = [
    'Travel',
    'Growth',
    'Fitness',
    'Family',
    'Work',
    'Creative',
    'Learning',
    'Health',
  ];

  @override
  void initState() {
    super.initState();
    _slideController = AnimationController(
      duration: const Duration(milliseconds: 400),
      vsync: this,
    );
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );

    _nameController.addListener(_validateName);
    _fadeController.forward();
  }

  @override
  void dispose() {
    _pageController.dispose();
    _slideController.dispose();
    _fadeController.dispose();
    _nameController.dispose();
    _labelController.dispose();
    _nameFocusNode.dispose();
    _labelFocusNode.dispose();
    super.dispose();
  }

  void _validateName() {
    final isValid = _nameController.text.trim().isNotEmpty;
    if (_nameValid != isValid) {
      setState(() {
        _nameValid = isValid;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTokens.canvas,
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(),
            _buildProgressIndicator(),
            Expanded(
              child: PageView(
                controller: _pageController,
                physics: const NeverScrollableScrollPhysics(),
                children: [
                  _buildNameStep(),
                  _buildTypeStep(),
                ],
              ),
            ),
            _buildBottomActions(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.all(AppTokens.spaceLg),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.close, size: 24),
            onPressed: () => context.pop(),
          ),
          Expanded(
            child: Text(
              _currentStep == 0 ? 'Create Project' : 'Choose Type',
              style: AppTokens.cardTitle,
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(width: 48), // Balance the close button
        ],
      ),
    );
  }

  Widget _buildProgressIndicator() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppTokens.spaceXxxl),
      child: Row(
        children: [
          for (int i = 0; i < _totalSteps; i++) ...[
            Expanded(
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                height: 4,
                decoration: BoxDecoration(
                  color: i <= _currentStep
                      ? AppTokens.ink
                      : AppTokens.hairline,
                  borderRadius: BorderRadius.circular(AppTokens.radiusFull),
                ),
              ),
            ),
            if (i < _totalSteps - 1) const SizedBox(width: AppTokens.spaceXs),
          ],
        ],
      ),
    );
  }

  Widget _buildNameStep() {
    return FadeTransition(
      opacity: _fadeController,
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(AppTokens.spaceXl),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: AppTokens.spaceXxxl),
            Text(
              'What\'s your project about?',
              style: AppTokens.headingMd,
            ),
            const SizedBox(height: AppTokens.spaceXs),
            Text(
              'Give it a name that captures the essence',
              style: AppTokens.subtitle,
            ),
            const SizedBox(height: AppTokens.spaceXxxl),

            // Project name field
            Text('Project Name *', style: AppTokens.bodyMdBold),
            const SizedBox(height: AppTokens.spaceSm),
            TextField(
              controller: _nameController,
              focusNode: _nameFocusNode,
              style: AppTokens.subtitle.copyWith(color: AppTokens.ink),
              decoration: InputDecoration(
                hintText: 'My amazing journey...',
                suffixIcon: _nameValid
                    ? const Icon(Icons.check_circle,
                        color: AppTokens.successText)
                    : null,
              ),
              textCapitalization: TextCapitalization.words,
              onSubmitted: (_) => _labelFocusNode.requestFocus(),
            ),

            const SizedBox(height: AppTokens.spaceXxl),

            // Label field
            Text('Label (Optional)', style: AppTokens.bodyMdBold),
            const SizedBox(height: AppTokens.spaceSm),
            TextField(
              controller: _labelController,
              focusNode: _labelFocusNode,
              style: AppTokens.subtitle.copyWith(color: AppTokens.ink),
              decoration: const InputDecoration(
                hintText: 'Travel, Growth, Fitness...',
              ),
              textCapitalization: TextCapitalization.words,
            ),

            const SizedBox(height: AppTokens.spaceLg),

            // Suggested labels
            Wrap(
              spacing: AppTokens.spaceXs,
              runSpacing: AppTokens.spaceXs,
              children: _suggestedLabels.map((label) {
                return GestureDetector(
                  onTap: () {
                    _labelController.text = label;
                    HapticFeedback.selectionClick();
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: AppTokens.spaceMd,
                        vertical: AppTokens.spaceXs),
                    decoration: BoxDecoration(
                      color: AppTokens.surface,
                      borderRadius: BorderRadius.circular(AppTokens.radiusFull),
                    ),
                    child: Text(
                      label,
                      style: AppTokens.bodySmMedium
                          .copyWith(color: AppTokens.charcoal),
                    ),
                  ),
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTypeStep() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppTokens.spaceXl),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: AppTokens.spaceXxxl),
          Text(
            'How do you want to organize?',
            style: AppTokens.headingMd,
          ),
          const SizedBox(height: AppTokens.spaceXs),
          Text(
            'Choose the structure that fits your style',
            style: AppTokens.subtitle,
          ),
          const SizedBox(height: AppTokens.spaceXxxl),

          // Timeline option
          _buildProjectTypeCard(
            type: ProjectType.timeline,
            title: 'Timeline',
            subtitle: 'Calendar-based recording',
            description:
                'Perfect for daily journaling, progress tracking, or any project where dates matter. Record videos on specific days and see your journey unfold chronologically.',
            icon: Icons.calendar_today_outlined,
            color: AppTokens.brandBlue,
          ),

          const SizedBox(height: AppTokens.spaceLg),

          // Freestyle option
          _buildProjectTypeCard(
            type: ProjectType.freestyle,
            title: 'Freestyle',
            subtitle: 'Record anytime, organize manually',
            description:
                'Great for creative projects, tutorials, or collections. Record whenever inspiration strikes and organize your videos however you like.',
            icon: Icons.video_collection_outlined,
            color: AppTokens.brandCoral,
          ),
        ],
      ),
    );
  }

  Widget _buildProjectTypeCard({
    required ProjectType type,
    required String title,
    required String subtitle,
    required String description,
    required IconData icon,
    required Color color,
  }) {
    final isSelected = _selectedType == type;

    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedType = type;
        });
        HapticFeedback.selectionClick();
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(AppTokens.spaceLg),
        decoration: BoxDecoration(
          color: isSelected
              ? color.withValues(alpha: 0.08)
              : AppTokens.surfaceSoft,
          borderRadius: BorderRadius.circular(AppTokens.radiusXxl),
          // Border only when selected — it's the selection signal.
          border: isSelected
              ? Border.all(color: color, width: 2)
              : null,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(AppTokens.radiusLg),
                  ),
                  child: Icon(icon, color: color, size: 24),
                ),
                const SizedBox(width: AppTokens.spaceMd),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(title, style: AppTokens.cardTitle),
                      Text(
                        subtitle,
                        style: AppTokens.bodySm
                            .copyWith(color: AppTokens.slate),
                      ),
                    ],
                  ),
                ),
                if (isSelected)
                  Icon(Icons.check_circle, color: color, size: 24),
              ],
            ),
            const SizedBox(height: AppTokens.spaceMd),
            Text(
              description,
              style: AppTokens.bodySm.copyWith(
                color: AppTokens.slate,
                height: 1.5,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomActions() {
    return Container(
      padding: EdgeInsets.fromLTRB(AppTokens.spaceXl, AppTokens.spaceMd,
          AppTokens.spaceXl, AppTokens.spaceMd + MediaQuery.of(context).padding.bottom),
      decoration: const BoxDecoration(color: AppTokens.canvas),
      child: Row(
        children: [
          if (_currentStep > 0)
            Expanded(
              child: OutlinedButton(
                onPressed: _goToPreviousStep,
                child: const Text('Back'),
              ),
            ),
          if (_currentStep > 0) const SizedBox(width: AppTokens.spaceMd),
          Expanded(
            flex: _currentStep == 0 ? 1 : 2,
            child: FilledButton(
              onPressed: _canProceed() ? _handleNextAction : null,
              child: _isCreating
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor:
                            AlwaysStoppedAnimation<Color>(AppTokens.onDark),
                      ),
                    )
                  : Text(
                      _currentStep == _totalSteps - 1
                          ? 'Create Project'
                          : 'Continue',
                    ),
            ),
          ),
        ],
      ),
    );
  }

  bool _canProceed() {
    if (_currentStep == 0) {
      return _nameValid;
    } else if (_currentStep == 1) {
      return _selectedType != null;
    }
    return false;
  }

  void _handleNextAction() {
    if (_currentStep < _totalSteps - 1) {
      _goToNextStep();
    } else {
      _createProject();
    }
  }

  void _goToNextStep() {
    setState(() {
      _currentStep++;
    });
    _pageController.nextPage(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
    HapticFeedback.lightImpact();
  }

  void _goToPreviousStep() {
    setState(() {
      _currentStep--;
    });
    _pageController.previousPage(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
    HapticFeedback.lightImpact();
  }

  Future<void> _createProject() async {
    if (_isCreating || !_canProceed()) return;

    setState(() {
      _isCreating = true;
    });

    try {
      final projectName = _nameController.text.trim();
      final label = _labelController.text.trim();

      // Create project with label if provided
      final finalName =
          label.isNotEmpty ? '$projectName ($label)' : projectName;

      await context.read<ProjectsProvider>().createProject(
            finalName,
            _selectedType!,
          );

      if (mounted) {
        HapticFeedback.mediumImpact();

        // Navigate back to projects list
        context.pop();

        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Project "$projectName" created successfully!'),
            backgroundColor: AppTokens.successText,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppTokens.radiusMd),
            ),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error creating project: $e'),
            backgroundColor: AppTokens.error,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppTokens.radiusMd),
            ),
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isCreating = false;
        });
      }
    }
  }
}

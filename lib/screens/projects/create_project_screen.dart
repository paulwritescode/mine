import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/projects_provider.dart';
import '../../core/models/project.dart';

class CreateProjectScreen extends StatefulWidget {
  const CreateProjectScreen({super.key});

  @override
  State<CreateProjectScreen> createState() => _CreateProjectScreenState();
}

class _CreateProjectScreenState extends State<CreateProjectScreen> with TickerProviderStateMixin {
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
      backgroundColor: Colors.white,
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
      padding: const EdgeInsets.all(20),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.close, size: 24),
            onPressed: () => context.pop(),
          ),
          Expanded(
            child: Text(
              _currentStep == 0 ? 'Create Project' : 'Choose Type',
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: Colors.black,
              ),
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
      padding: const EdgeInsets.symmetric(horizontal: 40),
      child: Row(
        children: [
          for (int i = 0; i < _totalSteps; i++) ...[
            Expanded(
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                height: 4,
                decoration: BoxDecoration(
                  color: i <= _currentStep ? Colors.black : Colors.grey[200],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            if (i < _totalSteps - 1) const SizedBox(width: 8),
          ],
        ],
      ),
    );
  }

  Widget _buildNameStep() {
    return FadeTransition(
      opacity: _fadeController,
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 40),
            // Handwritten style title
            const Text(
              'What\'s your project about?',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w300,
                color: Colors.black,
                height: 1.2,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Give it a name that captures the essence',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
                height: 1.4,
              ),
            ),
            const SizedBox(height: 40),
            
            // Project name field
            const Text(
              'Project Name *',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.black,
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _nameController,
              focusNode: _nameFocusNode,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w400,
              ),
              decoration: InputDecoration(
                hintText: 'My amazing journey...',
                hintStyle: TextStyle(
                  color: Colors.grey[400],
                  fontWeight: FontWeight.w300,
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide(color: Colors.grey[300]!),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: const BorderSide(color: Colors.black, width: 2),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide(color: Colors.grey[300]!),
                ),
                contentPadding: const EdgeInsets.all(20),
                suffixIcon: _nameValid
                    ? const Icon(Icons.check_circle, color: Colors.green)
                    : null,
              ),
              textCapitalization: TextCapitalization.words,
              onSubmitted: (_) => _labelFocusNode.requestFocus(),
            ),
            
            const SizedBox(height: 32),
            
            // Label field
            const Text(
              'Label (Optional)',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.black,
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _labelController,
              focusNode: _labelFocusNode,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w400,
              ),
              decoration: InputDecoration(
                hintText: 'Travel, Growth, Fitness...',
                hintStyle: TextStyle(
                  color: Colors.grey[400],
                  fontWeight: FontWeight.w300,
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide(color: Colors.grey[300]!),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: const BorderSide(color: Colors.black, width: 2),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide(color: Colors.grey[300]!),
                ),
                contentPadding: const EdgeInsets.all(20),
              ),
              textCapitalization: TextCapitalization.words,
            ),
            
            const SizedBox(height: 20),
            
            // Suggested labels
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _suggestedLabels.map((label) {
                return GestureDetector(
                  onTap: () {
                    _labelController.text = label;
                    HapticFeedback.selectionClick();
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.grey[100],
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.grey[300]!),
                    ),
                    child: Text(
                      label,
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[700],
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            
            const Spacer(),
          ],
        ),
      ),
    );
  }

  Widget _buildTypeStep() {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 40),
          const Text(
            'How do you want to organize?',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w300,
              color: Colors.black,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Choose the structure that fits your style',
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey[600],
              height: 1.4,
            ),
          ),
          const SizedBox(height: 40),
          
          // Timeline option
          _buildProjectTypeCard(
            type: ProjectType.timeline,
            title: 'Timeline',
            subtitle: 'Calendar-based recording',
            description: 'Perfect for daily journaling, progress tracking, or any project where dates matter. Record videos on specific days and see your journey unfold chronologically.',
            icon: Icons.calendar_today_outlined,
            color: const Color(0xFF4A90E2),
          ),
          
          const SizedBox(height: 20),
          
          // Freestyle option
          _buildProjectTypeCard(
            type: ProjectType.freestyle,
            title: 'Freestyle',
            subtitle: 'Record anytime, organize manually',
            description: 'Great for creative projects, tutorials, or collections. Record whenever inspiration strikes and organize your videos however you like.',
            icon: Icons.video_collection_outlined,
            color: const Color(0xFF7ED321),
          ),
          
          const Spacer(),
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
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: isSelected ? color.withOpacity(0.1) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? color : Colors.grey[300]!,
            width: isSelected ? 2 : 1,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: color.withOpacity(0.2),
                    blurRadius: 20,
                    offset: const Offset(0, 5),
                  ),
                ]
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
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(icon, color: color, size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w600,
                          color: Colors.black,
                        ),
                      ),
                      Text(
                        subtitle,
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
                if (isSelected)
                  Icon(Icons.check_circle, color: color, size: 24),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              description,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[700],
                height: 1.4,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomActions() {
    return Container(
      padding: EdgeInsets.fromLTRB(24, 16, 24, 16 + MediaQuery.of(context).padding.bottom),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: Row(
        children: [
          if (_currentStep > 0)
            Expanded(
              child: OutlinedButton(
                onPressed: _goToPreviousStep,
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  side: BorderSide(color: Colors.grey[300]!),
                ),
                child: const Text(
                  'Back',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.black,
                  ),
                ),
              ),
            ),
          if (_currentStep > 0) const SizedBox(width: 16),
          Expanded(
            flex: _currentStep == 0 ? 1 : 2,
            child: ElevatedButton(
              onPressed: _canProceed() ? _handleNextAction : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.black,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 0,
              ),
              child: _isCreating
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    )
                  : Text(
                      _currentStep == _totalSteps - 1 ? 'Create Project' : 'Continue',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
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
      final finalName = label.isNotEmpty ? '$projectName ($label)' : projectName;
      
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
            backgroundColor: Colors.green,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error creating project: $e'),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
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
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/tokens.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    
    _animationController = AnimationController(
      duration: AppTokens.animationSlow,
      vsync: this,
    );

    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));

    _scaleAnimation = Tween<double>(
      begin: 0.8,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.elasticOut,
    ));

    // Start animation and navigate after delay
    _startSplashSequence();
  }

  Future<void> _startSplashSequence() async {
    // Start the animation
    await _animationController.forward();
    
    // Wait for a moment to show the splash
    await Future.delayed(const Duration(milliseconds: 1500));
    
    // Navigate to main app
    if (mounted) {
      context.go('/');
    }
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTokens.primary700,
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              AppTokens.primary700,
              AppTokens.primary800,
              AppTokens.primary900,
            ],
          ),
        ),
        child: Center(
          child: AnimatedBuilder(
            animation: _animationController,
            builder: (context, child) {
              return FadeTransition(
                opacity: _fadeAnimation,
                child: ScaleTransition(
                  scale: _scaleAnimation,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // App Icon/Logo placeholder
                      Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          color: AppTokens.primary400,
                          borderRadius: BorderRadius.circular(AppTokens.radiusXLarge),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.2),
                              blurRadius: AppTokens.elevationHigh,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: const Icon(
                          Icons.video_library_rounded,
                          size: 60,
                          color: AppTokens.primary800,
                        ),
                      ),
                      
                      const SizedBox(height: AppTokens.spacing32),
                      
                      // App Name
                      Text(
                        'Mine',
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                          color: AppTokens.textOnDark,
                          letterSpacing: 1.2,
                        ),
                      ),
                      
                      const SizedBox(height: AppTokens.spacing8),
                      
                      // Tagline
                      Text(
                        'Capture Your Story',
                        style: TextStyle(
                          fontSize: 16,
                          color: AppTokens.primary400,
                          letterSpacing: 0.5,
                        ),
                      ),
                      
                      const SizedBox(height: AppTokens.spacing64),
                      
                      // Loading indicator
                      SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(
                            AppTokens.primary400,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
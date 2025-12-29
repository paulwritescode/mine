/**
 * Keyboard handling exports
 * Professional-grade keyboard handling system for Mine app
 */

// Hooks
export { useKeyboard } from '../hooks/useKeyboard';
export { useKeyboardController } from '../hooks/useKeyboardController';

// Professional Components
export { KeyboardSpacer } from '../components/KeyboardSpacer';
export { KeyboardAvoidingContainer } from '../components/KeyboardAvoidingContainer';

// Legacy Components (for backward compatibility)
export { KeyboardAvoidingWrapper } from '../components/KeyboardAvoidingWrapper';
export { KeyboardAwareForm } from '../components/KeyboardAwareForm';
export { KeyboardAnimatedView } from '../components/KeyboardAnimatedView';
export { MineInput } from '../components/MineInput';

// Types
export type { KeyboardState } from '../hooks/useKeyboard';
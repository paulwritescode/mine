import { view } from './storybook.requires';
import { ThemeProvider } from '../src/design-system';

const StorybookUIRoot = view.getStorybookUI({
  // Add any Storybook configuration here
});

// Wrap Storybook with our design system theme provider
export default function Storybook() {
  return (
    <ThemeProvider mode="light">
      <StorybookUIRoot />
    </ThemeProvider>
  );
}
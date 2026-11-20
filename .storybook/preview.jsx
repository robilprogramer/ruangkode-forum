import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { makeTestStore } from '../src/test/renderWithProviders';
import '../src/styles/main.css';

/** Setiap story dibungkus Redux store dan router agar komponen yang memakai hooks tetap berjalan. */
const withProviders = (Story, context) => (
  <Provider store={makeTestStore(context.parameters.preloadedState)}>
    <MemoryRouter>
      <div style={{ padding: 24, maxWidth: 760 }}>
        <Story />
      </div>
    </MemoryRouter>
  </Provider>
);

/** @type { import('@storybook/react').Preview } */
const preview = {
  decorators: [withProviders],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
};

export default preview;

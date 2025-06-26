import { Route } from '@context/viewProvider';
import WelcomeView from './welcome';

export const welcomeRoutes: Route[] = [
  {
    path: 'welcome',
    element: WelcomeView,
  },
];
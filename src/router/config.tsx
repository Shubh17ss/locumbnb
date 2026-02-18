import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const HomePage = lazy(() => import('../pages/home/page'));
const NotFoundPage = lazy(() => import('../pages/NotFound'));
const ForPhysiciansPage = lazy(() => import('../pages/for-physicians/page'));
const ForFacilitiesPage = lazy(() => import('../pages/for-facilities/page'));
const HowItWorksPage = lazy(() => import('../pages/how-it-works/page'));
const PricingPage = lazy(() => import('../pages/pricing/page'));
const OptionalServicesPage = lazy(() => import('../pages/optional-services/page'));
const PaymentsPage = lazy(() => import('../pages/payments/page'));
const LegalPage = lazy(() => import('../pages/legal/page'));
const TermsPage = lazy(() => import('../pages/terms/page'));
const PrivacyPage = lazy(() => import('../pages/privacy/page'));
const LoginPage = lazy(() => import('../pages/login/page'));
const SignupPage = lazy(() => import('../pages/signup/page'));
const SignupConfirmationPage = lazy(() => import('../pages/signup-confirmation/page'));
const ForgotPasswordPage = lazy(() => import('../pages/forgot-password/page'));
const PhysicianDashboardPage = lazy(() => import('../pages/physician-dashboard/page'));
const ProfileCompletionPage = lazy(() => import('../pages/profile-completion/page'));
const FacilityLoginPage = lazy(() => import('../pages/facility-login/page'));
const FacilityDashboardPage = lazy(() => import('../pages/facility-dashboard/page'));
const AdminLoginPage = lazy(() => import('../pages/admin-login/page'));
const AdminDashboardPage = lazy(() => import('../pages/admin-dashboard/page'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/for-physicians',
    element: <ForPhysiciansPage />,
  },
  {
    path: '/for-facilities',
    element: <ForFacilitiesPage />,
  },
  {
    path: '/how-it-works',
    element: <HowItWorksPage />,
  },
  {
    path: '/pricing',
    element: <PricingPage />,
  },
  {
    path: '/optional-services',
    element: <OptionalServicesPage />,
  },
  {
    path: '/payments',
    element: <PaymentsPage />,
  },
  {
    path: '/legal',
    element: <LegalPage />,
  },
  {
    path: '/terms',
    element: <TermsPage />,
  },
  {
    path: '/privacy',
    element: <PrivacyPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/signup-confirmation',
    element: <SignupConfirmationPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/physician-dashboard',
    element: <PhysicianDashboardPage />,
  },
  {
    path: '/profile-completion',
    element: <ProfileCompletionPage />,
  },
  {
    path: '/facility-login',
    element: <FacilityLoginPage />,
  },
  {
    path: '/facility-dashboard',
    element: <FacilityDashboardPage />,
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboardPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default routes;

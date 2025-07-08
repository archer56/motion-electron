import { useEffect } from 'react';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import { RouteUrls } from '../../../routes';

export const RouteSync = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isMoviePage = Boolean(useMatch(RouteUrls.MoviesCollectionPage));
  const isSeriesPage = Boolean(useMatch(RouteUrls.SeriesCollectionPage));

  console.log('🚀 ~ RouteSync ~ pathname:*****', pathname);

  const handleRouteChange = async () => {
    if (pathname === '/') {
      return;
    }

    if (isMoviePage || isSeriesPage) {
      await window.routeHistory.clearRoutes();
      await window.routeHistory.addRoute(pathname);
      return;
    }

    window.routeHistory.addRoute(pathname);
  };

  const handleAppLoad = async () => {
    const lastKnownRoute = window.lastKnownRoute.route;

    if (lastKnownRoute) {
      navigate(lastKnownRoute);
      return;
    }

    const routes = await window.routeHistory.getRoutes();
    const lastHistoryRoute = routes[routes.length - 1];

    if (lastHistoryRoute !== pathname) {
      navigate(lastHistoryRoute);
    }
  };

  useEffect(() => {
    handleAppLoad();
  }, []);

  useEffect(() => {
    handleRouteChange();
  }, [pathname]);

  return null;
};

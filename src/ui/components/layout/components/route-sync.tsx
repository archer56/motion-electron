import { useEffect } from 'react';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import { RouteUrls } from '../../../routes';

export const RouteSync = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isMovieCollectionPage = Boolean(useMatch(RouteUrls.MoviesCollectionPage));
  const isSeriesCollectionPage = Boolean(useMatch(RouteUrls.SeriesCollectionPage));

  const handleRouteChange = async () => {
    if (pathname === '/') {
      return;
    }

    if (isMovieCollectionPage || isSeriesCollectionPage) {
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

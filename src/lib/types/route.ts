export type RouteType = 'page' | 'post' | 'product' | 'taxonomy';

export type Route = {
  type: RouteType;
  id: number;
  slug: string;
};

export type RoutesMap = Record<string, Route>;

export type HttpsEndpoint = `https://${string}`;

type Config = {
  motion: HttpsEndpoint;
};

export const config: Config = {
  motion: 'https://motion.archers.world',
};

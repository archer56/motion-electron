export const isProduction = () => {
  return process?.env?.ENV?.toLowerCase?.() === 'production';
};

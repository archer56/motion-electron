export const rebuildNotifyPlugin = () => ({
  name: 'rebuild-notify',
  setup(build) {
    build.onEnd((result) => {
      const numberOfErrors = result.errors.length;
      const pural = numberOfErrors !== 1;
      console.log(`Built with ${numberOfErrors} error${pural ? 's' : ''}`);
    });
  },
});

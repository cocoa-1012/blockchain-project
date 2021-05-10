export const sgTrack = ({ event, properties, options, callback }) => {
  if (window.analytics) {
    window.analytics.track(event, properties, options, callback);
  }
};

export const sgIdentify = ({
  userId,
  traits,
  options,
  callback,
}: {
  userId: string;
  traits: any;
  options?: any;
  callback?: () => void;
}) => {
  if (window.analytics) {
    window.analytics.identify(userId, traits, options, callback);
  }
};

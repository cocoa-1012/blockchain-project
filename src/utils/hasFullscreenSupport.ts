export default function hasFullscreenSupport(): boolean {
  return (
    document?.fullscreenEnabled ||
    document?.webkitFullscreenEnabled ||
    document?.mozFullscreenEnabled
  );
}

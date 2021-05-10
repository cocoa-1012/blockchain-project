import confetti from 'canvas-confetti';
import { useCallback, useEffect } from 'react';

interface ConfettiCanvasProps {
  fireConfetti: boolean;
}

export default function ConfettiCanvas(
  props: ConfettiCanvasProps
): JSX.Element {
  const { fireConfetti } = props;

  const fire = useCallback((particleRatio, opts) => {
    const count = 250;
    const defaults = {
      origin: { y: 0.3 },
    };
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
        disableForReducedMotion: true,
        gravity: 0.8,
        scalar: 2,
        ticks: 550,
        shapes: ['square'],
        colors: [
          '#0200CD',
          '#FD7F00',
          '#FE01CD',
          '#3AEF05',
          '#04EFBB',
          '#F3EF05',
          '#9600CD',
        ],
      })
    );
  }, []);

  useEffect(() => {
    if (fireConfetti) {
      fire(0.15, {
        spread: 26 * 2,
        startVelocity: 55,
      });
      fire(0.15, {
        spread: 60 * 2,
      });
      fire(0.2, {
        spread: 100 * 1.5,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.25, {
        spread: 120 * 2.5,
        startVelocity: 45,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.25, {
        spread: 120 * 2.5,
        startVelocity: 45,
      });
    }
  }, [fireConfetti, fire]);

  return null;
}

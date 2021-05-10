import { styled, keyframes } from 'stitches.config';
import React, { useRef, useState, useEffect } from 'react';
import Cursor from 'assets/icons/cursor-icon.svg';
import Paintbrush from 'assets/icons/paintbrush-icon.svg';
import Trash from 'assets/icons/mini-trash-icon.svg';
import Flex from 'components/base/Flex';

const slide = keyframes({
  '0%': {
    right: -200,
  },
  '100%': {
    right: 0,
  },
});

const Icon = styled('div', {
  path: {
    transition: 'stroke $1 $ease',
  },
  cursor: 'pointer',
  '&:hover': {
    path: {
      stroke: '#000',
    },
  },

  variants: {
    stroke: {
      active: {
        path: {
          stroke: '#000',
        },
      },
      inactive: {
        path: {
          stroke: '#B3B3B3',
        },
      },
    },
  },
});

const ToolbarWrapper = styled(Flex, {
  position: 'fixed',
  animation: `${slide} 800ms forwards`,
  bottom: '50%',
  transform: 'translateY(-50%)',
  background: '#fff',
  boxShadow: '$1',
  borderBottomLeftRadius: '$3',
  borderTopLeftRadius: '$3',
  height: 160,
  width: 50,
  zIndex: 9999,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-around',
});

const StyledCanvas = styled('canvas', {
  touchAction: 'none',
  position: 'fixed',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
});

const Wrapper = styled('section', {
  display: 'none',
  '@bp1': {
    display: 'block',
  },
});

interface ToolbarAndSquiggleProps {
  canvasActive: boolean;
  setCanvasActive: (boolean) => void;
}

export default function ToolbarAndSquiggle(
  props: ToolbarAndSquiggleProps
): JSX.Element {
  const { setCanvasActive, canvasActive } = props;
  const refCanvas = useRef(null);
  const [canvasHeight, setCanvasHeight] = useState(null);
  const [canvasWidth, setCanvasWidth] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [position, setPosition] = useState({ x: null, y: null });
  const [hue, setHue] = useState(334);

  useEffect(() => {
    if (canvasActive) {
      const canvas = refCanvas.current;
      const context = canvas.getContext('2d');
      setCanvas(canvas);
      setCtx(context);
      if (typeof window !== null) {
        setCanvasHeight(document.body.getBoundingClientRect().height);
        setCanvasWidth(document.body.getBoundingClientRect().width);
      }
    }
  }, [canvasActive]);

  function draw(clientX: number, clientY: number) {
    // stop function from running if not mouseDown
    if (!isDrawing) {
      return;
    }
    const sq = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.strokeStyle = `hsl(${hue}, 90%, 55%)`;
    ctx.shadowColor = `hsl(${hue + 6}, 90%, 55%)`;
    ctx.lineWidth = 80;
    ctx.shadowBlur = 20;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    if (position.x !== null || position.y !== null) {
      ctx.moveTo(position.x - 0.1, position.y - 0.1);
    }
    ctx.lineTo(clientX - sq.left, clientY - sq.top);
    setPosition({ x: clientX - sq.left, y: clientY - sq.top });
    ctx.stroke();
    hue >= 360 ? setHue(0) : setHue((hue) => hue + 3);
  }

  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function handleMouseDown(e: React.MouseEvent) {
    if (canvasActive) {
      setIsDrawing(true);
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  return (
    <Wrapper>
      <ToolbarWrapper>
        <Icon stroke={canvasActive ? 'inactive' : 'active'}>
          <Cursor onClick={() => setCanvasActive(false)} />
        </Icon>
        <Icon stroke={canvasActive ? 'active' : 'inactive'}>
          <Paintbrush onClick={() => setCanvasActive(true)} />
        </Icon>
        <Icon>
          <Trash onClick={clear} />
        </Icon>
      </ToolbarWrapper>
      <StyledCanvas
        ref={refCanvas}
        width={canvasWidth}
        height={canvasHeight * 2}
        onMouseDown={handleMouseDown}
        onMouseMove={(e) => draw(e.clientX, e.clientY)}
        onMouseUp={() => setIsDrawing(false)}
        onMouseOut={() => setIsDrawing(false)}
        css={{
          cursor: canvasActive
            ? 'url(/images/icons/ellipse-icon.svg) 49 49, auto'
            : 'auto',
        }}
      />
    </Wrapper>
  );
}

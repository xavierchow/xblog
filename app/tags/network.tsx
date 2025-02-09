'use client';
import * as d3 from 'd3';
import { GeistSans } from 'geist/font/sans';
import { useEffect, useState, useRef } from 'react';
import { Data, Link, Node, SimulatedLink } from './types';
import { useRouter } from 'next/navigation';

export const RADIUS = 5;
function getRadius(weight: number) {
  weight = weight || 1;
  return weight * RADIUS + RADIUS / 2;
}

const drawNetwork = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  nodes: Node[],
  links: SimulatedLink[]
) => {
  context.clearRect(0, 0, width, height);

  links.forEach((link) => {
    if (link.source.x && link.source.y && link.target.x && link.target.y) {
      context.beginPath();
      context.strokeStyle = '#34342F';
      context.moveTo(link.source.x, link.source.y);
      context.lineTo(link.target.x, link.target.y);
      context.stroke();
    }
  });

  nodes.forEach((node) => {
    if (!node.x || !node.y) {
      return;
    }
    const radius = getRadius(node.weight);
    const gradient = context.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius);

    if (node.group === 'tag') {
      gradient.addColorStop(0, '#F07352');
      gradient.addColorStop(1, 'black');
    } else {
      gradient.addColorStop(0, 'white');
      gradient.addColorStop(1, 'black');
    }

    context.beginPath();
    context.moveTo(node.x + radius, node.y);
    context.arc(node.x, node.y, radius, 0, 2 * Math.PI);
    context.fillStyle = gradient;
    context.fill();
  });
};

type NetworkDiagramProps = {
  width: number;
  height: number;
  data: Data;
};

export const NetworkDiagram = ({ width, height, data }: NetworkDiagramProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initData = { nodes: [] as Node[], links: [] as SimulatedLink[] };
  const [simulatedData, setSimulatedData] = useState(initData);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!context) {
      return;
    }

    // The force simulation mutates links and nodes, so clone first
    const links: Link[] = data.links.map((d) => ({ ...d }));
    const nodes: Node[] = data.nodes.map((d) => ({ ...d }));

    d3.forceSimulation(nodes)
      .force(
        'link',
        d3.forceLink<Node, Link>(links).id((d) => d.id)
      )
      .force(
        'collide',
        d3.forceCollide((d) => getRadius(d.weight) + 8 * RADIUS)
      )
      .force('charge', d3.forceManyBody().strength(-20))
      .force('center', d3.forceCenter(width / 2, height / 2))

      .on('tick', () => {
        drawNetwork(context, width, height, nodes, links as SimulatedLink[]);
      })
      .on('end', () => {
        console.log(nodes);
        setSimulatedData({ nodes, links: links as SimulatedLink[] });
      });
  }, [width, height, data]);
  const router = useRouter();
  const navigate = (slug: string) => {
    router.push(`/posts/${slug}`);
  };

  return (
    <div className="overflow-auto relative">
      <canvas
        ref={canvasRef}
        style={{
          width,
          height,
        }}
        width={width}
        height={height}
      />
      {simulatedData && (
        <svg
          width={width}
          height={height}
          className={`absolute top-0 left-0 animate-fade ${GeistSans.className}`}
          viewBox={`0 0 ${width} ${height}`}
        >
          <g>
            {simulatedData.links.map((d, i) => {
              if (d.source.x && d.source.y && d.target.x && d.target.y) {
                return (
                  <line key={i} x1={d.source.x} y1={d.source.y} x2={d.target.x} y2={d.target.y} stroke="#34342F" />
                );
              }
            })}
          </g>
          <defs>
            <radialGradient id="yellowGradient">
              <stop offset="0%" stopColor="#F07352" />
              <stop offset="100%" stopColor="black" />
            </radialGradient>
            <radialGradient id="whiteGradient">
              <stop offset="0%" stopColor="white" />
              <stop offset="100%" stopColor="black" />
            </radialGradient>
          </defs>
          <g stroke="currentColor" strokeWidth="1">
            {simulatedData.nodes.map((d, i) => {
              return (
                <g onClick={() => d.group === 'article' && navigate(d.id)} key={i}>
                  <circle
                    fill={d.group === 'tag' ? 'url(#yellowGradient)' : 'url(#whiteGradient)'}
                    stroke="black"
                    cx={d.x}
                    cy={d.y}
                    r={getRadius(d.weight)}
                    className={d.group === 'article' ? 'cursor-pointer' : ''}
                  />
                  <text
                    x={d.x && d.x - 50 + getRadius(d.weight)}
                    y={d.y && d.y + 15 + getRadius(d.weight)}
                    color={d.group === 'tag' ? '#F07352' : 'white'}
                    className="text-sm font-thin"
                  >
                    {d.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      )}
    </div>
  );
};

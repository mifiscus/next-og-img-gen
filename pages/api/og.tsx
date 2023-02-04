import { ImageResponse } from "@vercel/og";
import { NextApiRequest } from "next";

export const config = {
  runtime: "edge",
};

export default async function handler(req: any) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get("foo");

  // Turn input props into more manageable forms that you can use in URL params
  // then parse here

  // ex: https://docs.imgix.com/apis/rendering/color-palette/colors

  const viewBox = "0 0 500 100";
  const width = "100%";
  const height = "100%";
  const className = "";
  const effects = {
    grainGradientPercent: "50%",
    backgroundColor: "#000",
    grainColor: "#fff",
    grainFrequency: 0.5,
  };

  // Example way of encoding props into url params
  const props = {
    gradient: 50,
    background: "black",
    color: "white",
    freq: 50,
    w: 100,
    h: 100,
    dim: { minw: 0, minh: 0, w: 500, h: 100 },
  };

  const params = new URLSearchParams();
  const str = encodeURIComponent(JSON.stringify(params));

  // probably look into an example that takes in url search params and parses and decodes them

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 50,
          color: "black",
          background: "white",
          width: "100%",
          height: "100%",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox={viewBox}
          width={width}
          height={height}
          preserveAspectRatio="none"
          className={className}
        >
          <defs>
            <linearGradient
              id="opacity-gradient"
              gradientTransform="rotate(90)"
            >
              <stop offset="0%" stopColor="#000"></stop>
              <stop
                offset={effects.grainGradientPercent}
                stopColor="#888"
              ></stop>
              <stop offset="100%" stopColor="#fff"></stop>
            </linearGradient>
            <mask id="alpha-mask" x="0" y="0" width="100%" height="100%">
              <rect
                x="0"
                y="0"
                width="100%"
                height="200%"
                fill="url(#opacity-gradient)"
              />
            </mask>

            <linearGradient
              id="gggrain-gradient"
              gradientTransform="rotate(90)"
            >
              <stop offset="0%" stopColor={effects.backgroundColor}></stop>
              <stop offset="100%" stopColor={effects.grainColor}></stop>
            </linearGradient>
            <filter
              id="gggrain-filter"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
              filterUnits="objectBoundingBox"
              primitiveUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency={effects.grainFrequency}
                numOctaves="2"
                seed="2"
                stitchTiles="stitch"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                result="turbulence"
              ></feTurbulence>
              <feColorMatrix
                type="saturate"
                values="0"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                in="turbulence"
                result="colormatrix"
              ></feColorMatrix>
              <feComponentTransfer
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                in="colormatrix"
                result="componentTransfer"
              >
                <feFuncR type="linear" slope="3"></feFuncR>
                <feFuncG type="linear" slope="3"></feFuncG>
                <feFuncB type="linear" slope="3"></feFuncB>
              </feComponentTransfer>
              <feColorMatrix
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                in="componentTransfer"
                result="colormatrix2"
                type="matrix"
                values="1 0 0 0 0
          0 1 0 0 0
          0 0 1 0 0
          0 0 0 15 -7"
              ></feColorMatrix>
            </filter>
          </defs>
          <g>
            <rect
              width="100%"
              height="100%"
              fill="url(#gggrain-gradient)"
            ></rect>
            <rect
              width="100%"
              height="100%"
              fill="transparent"
              filter="url(#gggrain-filter)"
              opacity="1"
              style={{ mixBlendMode: "soft-light" }}
              mask="url(#alpha-mask)"
            ></rect>
          </g>
        </svg>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

import React from 'react'
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg'

interface VennDiagramProps {
  size?: number
  fill?: string
  myHover?: boolean
  style?: any
}

const VennDiagram: React.FC<VennDiagramProps> = ({
  size = 28,
  fill = '#aaa',
  myHover = false,
  style = {},
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" style={style}>
      <Defs>
        <LinearGradient
          id="gradient-fill"
          gradientUnits="userSpaceOnUse"
          x1="2.044"
          x2="62"
          y1="32"
          y2="32"
        >
          <Stop offset="0" stopColor="#0fdcdd" />
          <Stop offset="1" stopColor="#46a1e8" />
        </LinearGradient>
      </Defs>
      <Path
        d="m44 14a17.723 17.723 0 0 0 -12 4.2 17.762 17.762 0 0 0 -12-4.2c-23.91 0-23.971 36 0 36a17.864 17.864 0 0 0 12.028-4.16 17.756 17.756 0 0 0 11.972 4.16c24.12 0 23.881-36 0-36zm-12 28.958a17.159 17.159 0 0 1 .026-21.958c5.318 5.982 5.283 15.952-.026 21.958zm-12-26.958a15.913 15.913 0 0 1 10.569 3.6c-6.014 6.749-6.035 18.026-.037 24.785a15.821 15.821 0 0 1 -10.532 3.615c-21.254 0-21.307-32 0-32zm24 32a15.8 15.8 0 0 1 -10.5-3.593c6.026-6.749 5.982-18.031-.044-24.792a15.809 15.809 0 0 1 10.544-3.615c21.44 0 21.227 32 0 32z"
        fill={myHover ? 'url(#gradient-fill)' : fill}
      />
    </Svg>
  )
}

export default VennDiagram

/** Light ribbons remain vector layers, independent of the celestial landscape. */
export default function AuroraRibbons() {
  return (
    <svg
      className="aurora-ribbons"
      viewBox="0 0 1600 1100"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <defs>
        <linearGradient
          id="aurora-curtain"
          x1="650"
          y1="0"
          x2="1350"
          y2="900"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1ec2ad" stopOpacity="0" />
          <stop offset=".24" stopColor="#26dab1" stopOpacity=".12" />
          <stop offset=".55" stopColor="#5be7b0" stopOpacity=".64" />
          <stop offset=".72" stopColor="#25bca6" stopOpacity=".22" />
          <stop offset="1" stopColor="#008caa" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="aurora-edge"
          x1="770"
          y1="-100"
          x2="1350"
          y2="820"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3ce4b4" stopOpacity=".08" />
          <stop offset=".43" stopColor="#8af5c6" stopOpacity=".82" />
          <stop offset=".8" stopColor="#29c6c4" stopOpacity=".12" />
          <stop offset="1" stopColor="#0a799a" stopOpacity="0" />
        </linearGradient>
        <filter id="aurora-soft">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id="aurora-glow">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <path
        d="M 830 -170 C 1130 80 640 230 880 423 S 1320 505 1190 790 S 1570 950 1670 1190"
        stroke="url(#aurora-curtain)"
        strokeWidth="190"
        filter="url(#aurora-soft)"
      />
      {Array.from({ length: 18 }, (_, i) => (
        <path
          key={i}
          d="M 830 -170 C 1130 80 640 230 880 423 S 1320 505 1190 790 S 1570 950 1670 1190"
          transform={`translate(${i * 2.2} ${-i * 6})`}
          stroke="url(#aurora-curtain)"
          strokeWidth={2 + (i % 3)}
          opacity={0.32 - i * 0.012}
          filter="url(#aurora-glow)"
        />
      ))}
      <path
        d="M 830 -170 C 1130 80 640 230 880 423 S 1320 505 1190 790 S 1570 950 1670 1190"
        stroke="url(#aurora-edge)"
        strokeWidth="27"
        filter="url(#aurora-glow)"
      />
      <path
        d="M 853 -165 C 1153 85 663 235 903 428 S 1343 510 1213 795 S 1593 955 1693 1195"
        stroke="url(#aurora-edge)"
        strokeWidth="4"
        opacity=".38"
        filter="url(#aurora-glow)"
      />
      <path
        d="M 1240 -140 C 980 70 1460 230 1280 420 S 1510 700 1710 660"
        stroke="url(#aurora-curtain)"
        strokeWidth="115"
        filter="url(#aurora-soft)"
        opacity=".7"
      />
      <path
        d="M 210 -160 C -130 140 360 180 120 460 S 180 810 -140 1030"
        stroke="url(#aurora-curtain)"
        strokeWidth="110"
        filter="url(#aurora-soft)"
        opacity=".4"
      />
    </svg>
  );
}

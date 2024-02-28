const BeaconIcon = () => (
  <svg
    id="beacon-icon"
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 12C8 9.87827 8.84286 7.84344 10.3431 6.34315C11.8434 4.84286 13.8783 4 16 4C18.1217 4 20.1566 4.84286 21.6569 6.34315C23.1571 7.84344 24 9.87827 24 12V20C24 22.1217 23.1571 24.1566 21.6569 25.6569C20.1566 27.1571 18.1217 28 16 28C13.8783 28 11.8434 27.1571 10.3431 25.6569C8.84286 24.1566 8 22.1217 8 20V12Z"
      stroke="#666666"
      strokeWidth={3}
      strokeLinejoin="round"
    />
    <path
      d="M16 9.33334V14.6667"
      stroke="#666666"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default BeaconIcon;

import styled from "styled-components";

const SocialMediaButtons = () => {
  return (
    <StyledWrapper>
      <div className="wrapper">
        <a
          href="https://facebook.com/augustine.mensah.3597"
          target="_blank"
          //   rel="noopener noreferrer"
          className="icon facebook"
        >
          <span className="tooltip">Facebook</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={4}
            >
              <path
                strokeDasharray={24}
                strokeDashoffset={24}
                d="M17 4l-2 0c-2.5 0 -4 1.5 -4 4v12"
              >
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  dur="0.62s"
                  values="24;0"
                ></animate>
              </path>
              <path strokeDasharray={8} strokeDashoffset={8} d="M8 12h7">
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  begin="0.775s"
                  dur="0.31s"
                  values="8;0"
                ></animate>
              </path>
            </g>
          </svg>
          {/* <svg
            viewBox="0 0 320 512"
            height="1.2em"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
          </svg> */}
        </a>
        <a
          href="https://x.com/@KobbyMenz_Jnr"
          target="_blank"
          className="icon twitter"
        >
          <span className="tooltip">X</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
          >
            <g fill="currentColor">
              <path d="M1 2h2.5L3.5 2h-2.5zM5.5 2h2.5L7.2 2h-2.5z">
                <animate
                  fill="freeze"
                  attributeName="d"
                  dur="0.62s"
                  values="M1 2h2.5L3.5 2h-2.5zM5.5 2h2.5L7.2 2h-2.5z;M1 2h2.5L18.5 22h-2.5zM5.5 2h2.5L23 22h-2.5z"
                ></animate>
              </path>
              <path d="M3 2h5v0h-5zM16 22h5v0h-5z">
                <animate
                  fill="freeze"
                  attributeName="d"
                  begin="0.62s"
                  dur="0.62s"
                  values="M3 2h5v0h-5zM16 22h5v0h-5z;M3 2h5v2h-5zM16 22h5v-2h-5z"
                ></animate>
              </path>
              <path d="M18.5 2h3.5L22 2h-3.5z">
                <animate
                  fill="freeze"
                  attributeName="d"
                  begin="0.775s"
                  dur="0.62s"
                  values="M18.5 2h3.5L22 2h-3.5z;M18.5 2h3.5L5 22h-3.5z"
                ></animate>
              </path>
            </g>
          </svg>
          {/* <svg
            height="1.8em"
            fill="currentColor"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            className="twitter"
          >
            <path d="M42,12.429c-1.323,0.586-2.746,0.977-4.247,1.162c1.526-0.906,2.7-2.351,3.251-4.058c-1.428,0.837-3.01,1.452-4.693,1.776C34.967,9.884,33.05,9,30.926,9c-4.08,0-7.387,3.278-7.387,7.32c0,0.572,0.067,1.129,0.193,1.67c-6.138-0.308-11.582-3.226-15.224-7.654c-0.64,1.082-1,2.349-1,3.686c0,2.541,1.301,4.778,3.285,6.096c-1.211-0.037-2.351-0.374-3.349-0.914c0,0.022,0,0.055,0,0.086c0,3.551,2.547,6.508,5.923,7.181c-0.617,0.169-1.269,0.263-1.941,0.263c-0.477,0-0.942-0.054-1.392-0.135c0.94,2.902,3.667,5.023,6.898,5.086c-2.528,1.96-5.712,3.134-9.174,3.134c-0.598,0-1.183-0.034-1.761-0.104C9.268,36.786,13.152,38,17.321,38c13.585,0,21.017-11.156,21.017-20.834c0-0.317-0.01-0.633-0.025-0.945C39.763,15.197,41.013,13.905,42,12.429" />
          </svg> */}
        </a>

        <a
          href="https://instagram.com"
          target="_blank"
          className="icon instagram"
        >
          <span className="tooltip">Instagram</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
          >
            <circle cx={17} cy={7} r={1.5} fill="currentColor" fillOpacity={0}>
              <animate
                fill="freeze"
                attributeName="fill-opacity"
                begin="2.015s"
                dur="0.232s"
                values="0;1"
              ></animate>
            </circle>
            <g
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
            >
              <path
                strokeDasharray={72}
                strokeDashoffset={72}
                d="M16 3c2.76 0 5 2.24 5 5v8c0 2.76 -2.24 5 -5 5h-8c-2.76 0 -5 -2.24 -5 -5v-8c0 -2.76 2.24 -5 5 -5h4Z"
              >
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  dur="0.93s"
                  values="72;0"
                ></animate>
              </path>
              <path
                strokeDasharray={28}
                strokeDashoffset={28}
                d="M12 8c2.21 0 4 1.79 4 4c0 2.21 -1.79 4 -4 4c-2.21 0 -4 -1.79 -4 -4c0 -2.21 1.79 -4 4 -4"
              >
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  begin="1.085s"
                  dur="0.93s"
                  values="28;0"
                ></animate>
              </path>
            </g>
          </svg>
        </a>

        <a
          href="https://linkedin.com/in/kobby-menz-jnr-a96732254"
          target="_blank"
          className="icon linkedin"
        >
          <span className="tooltip">linkedin</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={32}
            height={32}
            viewBox="0 0 32 32"
          >
            <path
              fill="currentColor"
              d="M8.643 4A2.64 2.64 0 0 0 6 6.64C6 8.1 7.183 9.31 8.64 9.31c1.459 0 2.643-1.21 2.643-2.668A2.64 2.64 0 0 0 8.643 4m12.892 7c-2.219 0-3.488 1.16-4.098 2.314h-.064v-2.003H13V26h4.557v-7.271c0-1.916.144-3.768 2.515-3.768c2.337 0 2.371 2.185 2.371 3.889V26H27v-8.068C27 13.984 26.151 11 21.535 11m-15.172.31V26h4.56V11.31z"
            ></path>
          </svg>
        </a>

        <a
          href="https://www.tiktok.com/@kobby_menz_jnr"
          target="_blank"
          className="icon tiktok"
        >
          <span className="tooltip">TikTok</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
          >
            <mask id="lineMdTiktok0">
              <g
                fill="none"
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              >
                <path
                  fill="#fff"
                  stroke="none"
                  d="M16.6 5.82c-0.68 -0.78 -1.06 -1.78 -1.06 -2.82h-3.09v12.4c-0.02 0.67 -0.31 1.31 -0.79 1.77c-0.48 0.47 -1.13 0.73 -1.8 0.73c-1.42 0 -2.6 -1.16 -2.6 -2.6c0 -1.72 1.66 -3.01 3.37 -2.48v-3.16c-3.45 -0.46 -6.47 2.22 -6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69 -2.55 5.69 -5.7v-6.29c1.25 0.9 2.76 1.38 4.3 1.38v-3.09c0 0 -1.88 0.09 -3.24 -1.48Z"
                ></path>
                <path
                  stroke="#000"
                  strokeDasharray={36}
                  strokeDashoffset={72}
                  strokeWidth={4}
                  d="M11 11h-1c-2.21 0 -4.5 1.79 -4.5 4c0 2.21 1.5 4.5 4.5 4.5c2.21 0 4 -2.29 4 -4.5v-12.5"
                >
                  <animate
                    fill="freeze"
                    attributeName="stroke-dashoffset"
                    dur="0.93s"
                    values="72;36"
                  ></animate>
                </path>
                <path
                  stroke="#000"
                  strokeDasharray={10}
                  strokeDashoffset={20}
                  strokeWidth={4}
                  d="M18 2.5v8"
                >
                  <animate
                    fill="freeze"
                    attributeName="stroke-dashoffset"
                    begin="0.775s"
                    dur="0.155s"
                    values="20;10"
                  ></animate>
                </path>
              </g>
            </mask>
            <rect
              width={24}
              height={24}
              fill="currentColor"
              mask="url(#lineMdTiktok0)"
            ></rect>
          </svg>
        </a>

        <a
          href="https://kobbymenz.github.io/portfolio/"
          target="_blank"
          className="icon website"
        >
          <span className="tooltip">Website</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={64}
            height={64}
            viewBox="0 0 48 48"
            stroke="#000"
          >
            <g fill="none" stroke="currentColor" strokeWidth={3}>
              <path
                strokeLinejoin="round"
                d="M3 24a21 21 0 1 0 42 0a21 21 0 1 0-42 0"
              ></path>
              <path
                strokeLinejoin="round"
                d="M15 24a9 21 0 1 1 18 0a9 21 0 1 1-18 0"
              ></path>
              <path strokeLinecap="round" d="M4.5 31h39m-39-14h39"></path>
            </g>
          </svg>
        </a>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .wrapper {
    display: inline-flex;
    list-style: none;
    // height: 10rem;
    width: 100%;
    padding: 2rem 0 1rem 0;
    font-family: "Poppins", sans-serif;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
  }

  

  .wrapper .icon {
    position: relative;
    background: rgba(44, 44, 44, 1);
    -webkit-backdrop-filter: blur(5rem);
    backdrop-filter: blur(5rem);

    border-radius: 50%;
    // margin: 1rem;
    width: 4rem;
    height: 4rem;
    font-size: 1.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .wrapper .icon a {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .wrapper .icon svg {
    width: 2.5rem;
    height: 2.5rem;
    color:#fff;
  }

  .wrapper .tooltip {
    position: absolute;
    top: 0;
    font-size: 1.4rem;
    background: #fff;
    color: #fff;
    padding: 0.5rem 0.8rem;
    border-radius: 0.5rem;
    box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.1);
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .wrapper .tooltip::before {
    position: absolute;
    content: "";
    height: 0.8rem;
    width: 0.8rem;
    background: #fff;
    bottom: -0.3rem;
    left: 50%;
    transform: translate(-50%) rotate(45deg);
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .wrapper .icon:hover .tooltip {
    top: -3.8rem;
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  .wrapper .icon:hover span,
  .wrapper .icon:hover .tooltip {
    text-shadow: 0rem -0.1rem 0rem rgba(0, 0, 0, 0.1);
  }

  .wrapper .facebook:hover,
  .wrapper .facebook:hover .tooltip,
  .wrapper .facebook:hover .tooltip::before {
    background: #1877f2; /*#1877f2*/
    color: #fff;
  }

  .wrapper .twitter:hover,
  .wrapper .twitter:hover .tooltip,
  .wrapper .twitter:hover .tooltip::before {
    background: #010101;
    color: #fff;
  }

  .wrapper .instagram:hover,
  .wrapper .instagram:hover .tooltip,
  .wrapper .instagram:hover .tooltip::before {
    background: #e4405f;
    color: #fff;
  }

  .wrapper .linkedin:hover,
  .wrapper .linkedin:hover .tooltip,
  .wrapper .linkedin:hover .tooltip::before {
    background: #0077b5;
    color: #fff;
  }

  .wrapper .tiktok:hover,
  .wrapper .tiktok:hover .tooltip,
  .wrapper .tiktok:hover .tooltip::before {
    background: #010101;
    color: #fff;
  }

  .wrapper .website:hover,
  .wrapper .website:hover .tooltip,
  .wrapper .website:hover .tooltip::before {
    background: var(--primary);
    color: #fff;
  }
`;

export default SocialMediaButtons;

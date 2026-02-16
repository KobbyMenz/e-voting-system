import classes from "../Loader/Loader.module.css";
// import Logo from "../../assets/images/KM_Inventory_logo_new.ico";

//import ReactDOM from "react-dom";

const Loader = () => {
  return (
    <>
      <div className={classes.loader_container}>
        {/* <img className={classes.img} src={Logo} alt="logo" /> */}

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={64}
          height={64}
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
            opacity={0.5}
          ></path>
          <path
            fill="currentColor"
            d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"
          >
            <animateTransform
              attributeName="transform"
              dur="0.8s"
              from="0 12 12"
              repeatCount="indefinite"
              to="360 12 12"
              type="rotate"
            ></animateTransform>
          </path>
        </svg>
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="3" r="0" fill="currentColor">
            <animate
              id="svgSpinners6DotsScale0"
              fill="freeze"
              attributeName="r"
              begin="0;svgSpinners6DotsScale2.end-0.5s"
              calcMode="spline"
              dur="0.6s"
              keySplines="0,1,0,1;.53,0,.61,.73"
              keyTimes="0;.2;1"
              values="0;2;0"
            />
          </circle>
          <circle cx="16.5" cy="4.21" r="0" fill="currentColor">
            <animate
              id="svgSpinners6DotsScale1"
              fill="freeze"
              attributeName="r"
              begin="svgSpinners6DotsScale0.begin+0.1s"
              calcMode="spline"
              dur="0.6s"
              keySplines="0,1,0,1;.53,0,.61,.73"
              keyTimes="0;.2;1"
              values="0;2;0"
            />
          </circle>
          <circle cx="7.5" cy="4.21" r="0" fill="currentColor">
            <animate
              id="svgSpinners6DotsScale2"
              fill="freeze"
              attributeName="r"
              begin="svgSpinners6DotsScale4.begin+0.1s"
              calcMode="spline"
              dur="0.6s"
              keySplines="0,1,0,1;.53,0,.61,.73"
              keyTimes="0;.2;1"
              values="0;2;0"
            />
          </circle>
          <circle cx="19.79" cy="7.5" r="0" fill="currentColor">
            <animate
              id="svgSpinners6DotsScale3"
              fill="freeze"
              attributeName="r"
              begin="svgSpinners6DotsScale1.begin+0.1s"
              calcMode="spline"
              dur="0.6s"
              keySplines="0,1,0,1;.53,0,.61,.73"
              keyTimes="0;.2;1"
              values="0;2;0"
            />
          </circle>
          <circle cx="4.21" cy="7.5" r="0" fill="currentColor">
            <animate
              id="svgSpinners6DotsScale4"
              fill="freeze"
              attributeName="r"
              begin="svgSpinners6DotsScale6.begin+0.1s"
              calcMode="spline"
              dur="0.6s"
              keySplines="0,1,0,1;.53,0,.61,.73"
              keyTimes="0;.2;1"
              values="0;2;0"
            />
          </circle>
          <circle cx="21" cy="12" r="0" fill="currentColor">
            <animate
              id="svgSpinners6DotsScale5"
              fill="freeze"
              attributeName="r"
              begin="svgSpinners6DotsScale3.begin+0.1s"
              calcMode="spline"
              dur="0.6s"
              keySplines="0,1,0,1;.53,0,.61,.73"
              keyTimes="0;.2;1"
              values="0;2;0"
            />
          </circle>
          <circle cx="3" cy="12" r="0" fill="currentColor">
            <animate
              id="svgSpinners6DotsScale6"
              fill="freeze"
              attributeName="r"
              begin="svgSpinners6DotsScale8.begin+0.1s"
              calcMode="spline"
              dur="0.6s"
              keySplines="0,1,0,1;.53,0,.61,.73"
              keyTimes="0;.2;1"
              values="0;2;0"
            />
          </circle>
          <circle cx="19.79" cy="16.5" r="0" fill="currentColor">
            <animate
              id="svgSpinners6DotsScale7"
              fill="freeze"
              attributeName="r"
              begin="svgSpinners6DotsScale5.begin+0.1s"
              calcMode="spline"
              dur="0.6s"
              keySplines="0,1,0,1;.53,0,.61,.73"
              keyTimes="0;.2;1"
              values="0;2;0"
            />
          </circle>
          <circle cx="4.21" cy="16.5" r="0" fill="currentColor">
            <animate
              id="svgSpinners6DotsScale8"
              fill="freeze"
              attributeName="r"
              begin="svgSpinners6DotsScalea.begin+0.1s"
              calcMode="spline"
              dur="0.6s"
              keySplines="0,1,0,1;.53,0,.61,.73"
              keyTimes="0;.2;1"
              values="0;2;0"
            />
          </circle>
          <circle cx="16.5" cy="19.79" r="0" fill="currentColor">
            <animate
              id="svgSpinners6DotsScale9"
              fill="freeze"
              attributeName="r"
              begin="svgSpinners6DotsScale7.begin+0.1s"
              calcMode="spline"
              dur="0.6s"
              keySplines="0,1,0,1;.53,0,.61,.73"
              keyTimes="0;.2;1"
              values="0;2;0"
            />
          </circle>
          <circle cx="7.5" cy="19.79" r="0" fill="currentColor">
            <animate
              id="svgSpinners6DotsScalea"
              fill="freeze"
              attributeName="r"
              begin="svgSpinners6DotsScaleb.begin+0.1s"
              calcMode="spline"
              dur="0.6s"
              keySplines="0,1,0,1;.53,0,.61,.73"
              keyTimes="0;.2;1"
              values="0;2;0"
            />
          </circle>
          <circle cx="12" cy="21" r="0" fill="currentColor">
            <animate
              id="svgSpinners6DotsScaleb"
              fill="freeze"
              attributeName="r"
              begin="svgSpinners6DotsScale9.begin+0.1s"
              calcMode="spline"
              dur="0.6s"
              keySplines="0,1,0,1;.53,0,.61,.73"
              keyTimes="0;.2;1"
              values="0;2;0"
            />
          </circle>
        </svg> */}

        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <rect width="6" height="14" x="1" y="4" fill="currentColor">
            <animate
              id="svgSpinnersBarsScaleFade0"
              fill="freeze"
              attributeName="y"
              begin="0;svgSpinnersBarsScaleFade1.end-0.25s"
              dur="0.75s"
              values="1;5"
            />
            <animate
              fill="freeze"
              attributeName="height"
              begin="0;svgSpinnersBarsScaleFade1.end-0.25s"
              dur="0.75s"
              values="22;14"
            />
            <animate
              fill="freeze"
              attributeName="opacity"
              begin="0;svgSpinnersBarsScaleFade1.end-0.25s"
              dur="0.75s"
              values="1;0.2"
            />
          </rect>
          <rect
            width="6"
            height="14"
            x="9"
            y="4"
            fill="currentColor"
            opacity="0.4"
          >
            <animate
              fill="freeze"
              attributeName="y"
              begin="svgSpinnersBarsScaleFade0.begin+0.15s"
              dur="0.75s"
              values="1;5"
            />
            <animate
              fill="freeze"
              attributeName="height"
              begin="svgSpinnersBarsScaleFade0.begin+0.15s"
              dur="0.75s"
              values="22;14"
            />
            <animate
              fill="freeze"
              attributeName="opacity"
              begin="svgSpinnersBarsScaleFade0.begin+0.15s"
              dur="0.75s"
              values="1;0.2"
            />
          </rect>
          <rect
            width="6"
            height="14"
            x="17"
            y="4"
            fill="currentColor"
            opacity="0.3"
          >
            <animate
              id="svgSpinnersBarsScaleFade1"
              fill="freeze"
              attributeName="y"
              begin="svgSpinnersBarsScaleFade0.begin+0.3s"
              dur="0.75s"
              values="1;5"
            />
            <animate
              fill="freeze"
              attributeName="height"
              begin="svgSpinnersBarsScaleFade0.begin+0.3s"
              dur="0.75s"
              values="22;14"
            />
            <animate
              fill="freeze"
              attributeName="opacity"
              begin="svgSpinnersBarsScaleFade0.begin+0.3s"
              dur="0.75s"
              values="1;0.2"
            />
          </rect>
        </svg> */}

        {/* <svg
          width="200"
          height="200"
          viewBox="0 0 57 57"
          xmlns="http://www.w3.org/2000/svg"
          stroke="#fff"
        >
          <g fill="none" fillRule="evenodd">
            <g transform="translate(1 1)" strokeWidth="2">
              <circle cx="5" cy="50" r="6" fill="#0c007c">
                <animate
                  attributeName="cy"
                  begin="0s"
                  dur="2.2s"
                  values="50;5;50;50"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cx"
                  begin="0s"
                  dur="2.2s"
                  values="5;27;49;5"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="27" cy="5" r="6" fill="#007aba">
                <animate
                  attributeName="cy"
                  begin="0s"
                  dur="2.2s"
                  from="5"
                  to="5"
                  values="5;50;50;5"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cx"
                  begin="0s"
                  dur="2.2s"
                  from="27"
                  to="27"
                  values="27;49;5;27"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="49" cy="50" r="6" fill="#ec288e">
                <animate
                  attributeName="cy"
                  begin="0s"
                  dur="2.2s"
                  values="50;50;5;50"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cx"
                  from="49"
                  to="49"
                  begin="0s"
                  dur="2.2s"
                  values="49;5;27;49"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </g>
        </svg> */}
      </div>
    </>
  );
};
export default Loader;

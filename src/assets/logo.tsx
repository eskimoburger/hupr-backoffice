import { FC } from "react";

const Logo: FC<{
  width?: string;
  height?: string;
}> = ({ width = "48", height = "48" }) => (
  <svg
    {...{ width, height }}
    viewBox="0 0 52 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.24 26.1404L33.8 30.1106V14.612L19.24 18.5796V26.1404ZM14.04 28.1268C14.0399 28.6973 14.2274 29.2521 14.5737 29.7055C14.92 30.1589 15.4058 30.4858 15.9562 30.6358L35.7162 36.0256C36.1021 36.1308 36.5071 36.1456 36.8997 36.0687C37.2923 35.9918 37.6618 35.8254 37.9795 35.5824C38.2973 35.3393 38.5547 35.0263 38.7316 34.6675C38.9086 34.3088 39.0005 33.9141 39 33.514V11.2034C39.0001 10.8036 38.9079 10.4092 38.7308 10.0508C38.5536 9.69238 38.2962 9.37965 37.9785 9.13692C37.6608 8.89419 37.2914 8.728 36.8991 8.65125C36.5067 8.57451 36.1019 8.58929 35.7162 8.69444L15.9562 14.0842C15.4058 14.2343 14.92 14.5612 14.5737 15.0146C14.2274 15.468 14.0399 16.0227 14.04 16.5932V28.1268Z"
      fill="#666666"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.0416 25.48V19.24H10.3194C9.78056 20.192 9.49824 21.2676 9.50007 22.3614C9.50189 23.4553 9.78779 24.5299 10.3298 25.48H13.0416ZM15.6416 30.68C16.3311 30.68 16.9925 30.4061 17.4801 29.9185C17.9676 29.4309 18.2416 28.7696 18.2416 28.08V16.64C18.2416 15.9505 17.9676 15.2892 17.4801 14.8016C16.9925 14.314 16.3311 14.04 15.6416 14.04H8.45778C8.26311 14.0399 8.07047 14.0794 7.89164 14.1563C7.71281 14.2332 7.55156 14.3458 7.41778 14.4872C3.25258 18.8838 3.27078 25.805 7.41258 30.2224C7.54744 30.3667 7.71048 30.4818 7.89161 30.5605C8.07273 30.6392 8.26809 30.6799 8.46558 30.68H15.6416Z"
      fill="#666666"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.7024 31.2H15.184L13.1924 39H14.7082L16.7024 31.2ZM15.184 26C14.0284 26 12.9058 26.3849 11.9933 27.094C11.0809 27.803 10.4306 28.7958 10.1452 29.9156L7.32678 40.9578C7.22888 41.3418 7.22008 41.7432 7.30106 42.1312C7.38204 42.5192 7.55064 42.8835 7.79399 43.1963C8.03734 43.5092 8.34899 43.7623 8.70512 43.9362C9.06125 44.1101 9.45243 44.2004 9.84878 44.2H14.7108C15.8655 44.1995 16.9873 43.8147 17.8992 43.1062C18.8111 42.3977 19.4612 41.4058 19.747 40.287L21.7412 32.487C21.9373 31.7191 21.9554 30.9166 21.7939 30.1407C21.6325 29.3647 21.2958 28.636 20.8096 28.0101C20.3235 27.3842 19.7007 26.8777 18.9888 26.5293C18.277 26.181 17.4949 25.9999 16.7024 26H15.184ZM49.4832 11.557C49.6727 11.841 49.8044 12.1597 49.8708 12.4946C49.9372 12.8296 49.937 13.1744 49.8701 13.5093C49.8032 13.8441 49.671 14.1626 49.481 14.4464C49.2911 14.7301 49.0471 14.9737 48.763 15.1632L44.863 17.7632C44.2893 18.1459 43.587 18.285 42.9107 18.15C42.2344 18.0149 41.6395 17.6167 41.2568 17.043C40.8741 16.4693 40.7349 15.767 40.87 15.0907C41.0051 14.4144 41.4033 13.8195 41.977 13.4368L45.877 10.8368C46.161 10.6472 46.4797 10.5155 46.8146 10.4491C47.1496 10.3828 47.4944 10.383 47.8293 10.4499C48.1641 10.5168 48.4826 10.649 48.7663 10.8389C49.0501 11.0289 49.2937 11.2729 49.4832 11.557ZM40.82 22.36C40.82 21.6704 41.0939 21.0091 41.5815 20.5215C42.0691 20.0339 42.7304 19.76 43.42 19.76H47.32C48.0095 19.76 48.6709 20.0339 49.1585 20.5215C49.646 21.0091 49.92 21.6704 49.92 22.36C49.92 23.0495 49.646 23.7109 49.1585 24.1985C48.6709 24.6861 48.0095 24.96 47.32 24.96H43.42C42.7304 24.96 42.0691 24.6861 41.5815 24.1985C41.0939 23.7109 40.82 23.0495 40.82 22.36ZM41.4284 27.3234C41.6479 27.0618 41.9168 26.8461 42.2197 26.6884C42.5226 26.5308 42.8536 26.4344 43.1938 26.4047C43.534 26.375 43.8767 26.4126 44.2024 26.5153C44.528 26.6181 44.8302 26.784 45.0918 27.0036L48.6798 30.0196C49.1891 30.4684 49.5027 31.0987 49.5535 31.7757C49.6043 32.4527 49.3883 33.1227 48.9517 33.6426C48.515 34.1624 47.8924 34.4908 47.2168 34.5577C46.5412 34.6245 45.8662 34.4244 45.3362 34.0002L41.7482 30.9842C41.2207 30.5409 40.8907 29.9064 40.8307 29.22C40.7708 28.5336 40.9857 27.8514 41.4284 27.3234Z"
      fill="#B28A4C"
    />
  </svg>
);

export default Logo;

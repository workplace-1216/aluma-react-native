import * as React from 'react';
import Svg, {
  SvgProps,
  Rect,
  Path,
  Defs,
  Pattern,
  Use,
  Image,
  Circle,
} from 'react-native-svg';

function SvgSettings({
  color = 'black',
  size = 24,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <Svg viewBox="0 0 50 50" width={size} height={size} fill={color}>
      <Path d="M22.205 2a1 1 0 00-.986.838l-.973 5.955c-1.17.34-2.285.8-3.336 1.371l-4.914-3.51a1 1 0 00-1.287.106l-3.89 3.886a1 1 0 00-.112 1.282l3.457 4.945a16.92 16.92 0 00-1.398 3.36l-5.93.986a1 1 0 00-.834.986v5.5a1 1 0 00.824.986l5.934 1.051a16.82 16.82 0 001.394 3.36l-3.5 4.896a1 1 0 00.106 1.287l3.888 3.89a1 1 0 001.28.114l4.955-3.469a16.85 16.85 0 003.346 1.381l.99 5.963a1 1 0 00.986.836h5.5a1 1 0 00.986-.826l1.061-5.986a16.85 16.85 0 003.33-1.397l4.988 3.5a1 1 0 001.282-.111l3.888-3.893a1 1 0 00.104-1.29l-3.557-4.938a16.769 16.769 0 001.367-3.311l6.018-1.055a1 1 0 00.826-.986v-5.5a1 1 0 00-.838-.986l-6.008-.983a16.885 16.885 0 00-1.37-3.306l3.507-4.998a1 1 0 00-.111-1.282l-3.89-3.888a1 1 0 00-1.292-.104l-4.924 3.541a16.76 16.76 0 00-3.334-1.389l-1.047-5.984A1 1 0 0027.705 2h-5.5zm.852 2h3.808l.996 5.686a1 1 0 00.743.798c1.462.365 2.836.943 4.09 1.702a1 1 0 001.1-.043l4.68-3.364 2.694 2.694-3.332 4.748a1 1 0 00-.04 1.09 14.926 14.926 0 011.686 4.07 1 1 0 00.809.744l5.707.934v3.808l-5.719 1.004a1 1 0 00-.797.746 14.798 14.798 0 01-1.681 4.069 1 1 0 00.045 1.1l3.379 4.689-2.694 2.695-4.74-3.326a1 1 0 00-1.094-.035 14.894 14.894 0 01-4.08 1.709 1 1 0 00-.74.794L26.867 46h-3.814l-.942-5.662a1 1 0 00-.746-.807 14.902 14.902 0 01-4.105-1.695 1 1 0 00-1.088.039l-4.703 3.295-2.696-2.7 3.325-4.646a1 1 0 00.04-1.1 14.859 14.859 0 01-1.71-4.115 1 1 0 00-.795-.742l-5.631-1v-3.814l5.627-.936a1 1 0 00.807-.744 14.953 14.953 0 011.71-4.117 1 1 0 00-.035-1.092L8.826 11.47l2.697-2.696 4.663 3.332a1 1 0 001.095.043 14.83 14.83 0 014.104-1.685 1 1 0 00.748-.81L23.057 4zM25 17c-4.406 0-8 3.594-8 8 0 4.406 3.594 8 8 8 4.406 0 8-3.594 8-8 0-4.406-3.594-8-8-8zm0 2c3.326 0 6 2.674 6 6s-2.674 6-6 6-6-2.674-6-6 2.674-6 6-6z" />
    </Svg>
  );
}

function SvgHome({color, size}: {color: string; size: number}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path
        fill="none"
        fillRule="evenodd"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9.157 20.771v-3.066c0-.78.636-1.414 1.424-1.42h2.886c.792 0 1.434.636 1.434 1.42h0v3.076c0 .662.533 1.203 1.202 1.219h1.924c1.918 0 3.473-1.54 3.473-3.438h0V9.838a2.44 2.44 0 00-.962-1.905l-6.58-5.248a3.18 3.18 0 00-3.945 0L3.462 7.943A2.42 2.42 0 002.5 9.847v8.715C2.5 20.46 4.055 22 5.973 22h1.924c.685 0 1.241-.55 1.241-1.229h0"
      />
    </Svg>
  );
}

function SvgMenu(props: SvgProps) {
  return (
    <Svg
      width={30}
      height={30}
      viewBox="0 0 16.933 16.933"
      fill={'white'}
      {...props}>
      <Path d="M12.271 1.323H1.984c-1.1-.042-1.1 1.63 0 1.588H12.23c1.08.042 1.122-1.588.042-1.588zM1.984 7.673c-1.058 0-1.058 1.587 0 1.587h5.8c1.08 0 1.08-1.587 0-1.587zm0 6.35c-1.058 0-1.058 1.587 0 1.587h12.997c1.058 0 1.058-1.587 0-1.587z" />
    </Svg>
  );
}

function SvgError(props: SvgProps) {
  return (
    <Svg width={16} height={16} viewBox="0 0 64 64" {...props}>
      <Circle
        cx={32}
        cy={32}
        r={28}
        fill="none"
        stroke="red"
        strokeMiterlimit={10}
        strokeWidth={4}
      />
      <Path
        fill="none"
        stroke="red"
        strokeMiterlimit={10}
        strokeWidth={4}
        d="M32 18L32 38"
      />
      <Path
        fill="none"
        stroke="red"
        strokeMiterlimit={10}
        strokeWidth={4}
        d="M32 42L32 46"
      />
    </Svg>
  );
}

function SvgGoogle(props: SvgProps) {
  return (
    <Svg
      width={25}
      height={25}
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 256 262"
      {...props}>
      <Path
        fill="#4285F4"
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
      />
      <Path
        fill="#34A853"
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
      />
      <Path
        fill="#FBBC05"
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
      />
      <Path
        fill="#EB4335"
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
      />
    </Svg>
  );
}

function SvgHeart({
  size = 24,
  color = '#FFFFFF',
  filled = false,
}: {
  size?: number;
  color?: string;
  filled?: boolean;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.84 4.61a5.5 5.5 0 00-7.78-.08L12 5.6l-1.06-1.07a5.5 5.5 0 00-7.78.08 5.61 5.61 0 00.08 7.86l7.19 7.11a1 1 0 001.42 0l7.19-7.11a5.61 5.61 0 00.08-7.86z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
function SvgHeadphones({width = 38, height = 38, ...props}: SvgProps) {
  return (
    <Svg
      {...props}
      width={width}
      height={height}
      viewBox="0 0 38 38"
      fill="none">
      <Path fill="url(#pattern0_601_22)" d="M0 0H38V38H0z" />
      <Defs>
        <Pattern
          id="pattern0_601_22"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}>
          <Use xlinkHref="#image0_601_22" transform="scale(.01042)" />
        </Pattern>
        <Image
          id="image0_601_22"
          width={96}
          height={96}
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAE6GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjAgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTEwLTIxVDEzOjQ3OjUwKzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0xMi0xMVQxOTo1NzowNVoiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMTItMTFUMTk6NTc6MDVaIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphMzRmZWE5NC1hM2E1LTRkMmQtYWE1NS01MWFjYWI4YWEzODYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6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"
        />
      </Defs>
    </Svg>
  );
}
function SvgCircleArrow({width = 19, height = 19, ...props}: SvgProps) {
  return (
    <Svg
      {...props}
      width={width}
      height={height}
      viewBox="0 0 19 19"
      fill="none">
      <Circle cx={9.5} cy={9.5} r={8.75} stroke="#fff" strokeWidth={1.5} />
      <Path
        d="M8 6l3.5 4L8 14"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SvgBack({width = 29, height = 28, ...props}: SvgProps) {
  return (
    <Svg
      {...props}
      width={width}
      height={height}
      viewBox="0 0 29 28"
      fill="none">
      <Path fill="url(#pattern0_601_145)" d="M0 0H29V28H0z" />
      <Defs>
        <Pattern
          id="pattern0_601_145"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}>
          <Use
            xlinkHref="#image0_601_145"
            transform="matrix(.01299 0 0 .01345 0 -.004)"
          />
        </Pattern>
        <Image
          id="image0_601_145"
          width={77}
          height={75}
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE0AAABLCAYAAAA1UAqtAAAACXBIWXMAAAsTAAALEwEAmpwYAAANKklEQVR4nOWceVRTVx7Hv0keWUjCEFAaARcYdLC2alXQdhSkOGqRKXSQqhkFRU4VxEpVcFRaULHiUpeDg1BBR9qgYEc6DlZ6kEVcqgPq6ZECU7R1g9FWCBpkabb5A0OR5r28JA8S28857xzy3u8u+XLvfb977++GxWazwSQikUgil8tTgoODx/a+f+DAgdJdu3alMlXO3bt3AQBcLhdsNhssFgsqlQpqtRo6nQ5z5sxBUlISbt26hWvXruHChQtobW2FTCbD2bNnUVJSgtDQUJw+fRqTJ09GeHg4EhMTIZVK4ebmBjabjcbGRjQ3N/+ibGYVA7hpaWkr+goGABEREf4AhjJcnlUgtFotbWMOhwM+nw+RSASBQAAXFxcMGjQIBEFg1KhR8PT0TIyJiQk0lFYoFBIjR450B3DX0kqXlZVZmoVFEAzmtZRMMABoampS3rlzp8HSQvTd0powJdrsnTt3LqQy2Ldv30kAD80t4N69e+YmZRwmRAssKChIpDJISUk5sWPHjhxzC+ByueDxeOYmZxxLRfPNyclZxePxWGQGubm5X6WmpmYB0JmauZ2dnUWV6y8seXsOLywsfF8qlYrJDL744ovrixcv3gzgJ1MydnBwgEAgsKBq/Yu5Lc3t5MmT21xdXUVkBhcvXrwlk8lSAHTSzVQgENhs6+qNOaI55ufnJ7/88stDyAwaGhoehoeHfwCghU6Gz4NQvTG1e/KOHDnyvr+//0gyg6amJuWbb76ZDBr+mFgsBpfLNbEK1seUlkbs3bs3ISwsbAKZwaNHj1Tz589PA1BLlZFIJAKLRfrusHl6RGOz2RAKhZBIJAAAqVQKd3d36HQ6eHh4YOjQoavj4uJInVetVouQkJAUABfJbJ63bkgG3e4ZHR8f/wbZQ41Gg3feeScTJILx+fxfjWAAPdGCPvroo79SGWzduvUEgPy+93U6HUQi0hfsc4uxMe0NuVz+HpXBtm3bTiYnJ+/ve/95cR/MgUq0ienp6TECgYDUJjc392JKSsoz3v6vVajekAky7PTp06lOTk58soTnzp1riIyMTOZyuWqg233o6uqCTmfybOm5w9CYNqKoqCiNSrCysrL/hoaGbgSgtrOzg1hMOpP6VdJXNMfc3Nz1VN5+XV3d/ejo6DSlUvnjb6ErGqJ39+QdO3Ys1d/ffxSZ8YMHD9reeuutLd9///1tu58V6+2l9u2bZM/opLE0Ly0ADfoBvWhEVlbWhqCgoDFUxgKBgMjPz1/bSzCwWCywnrr3Wq1WZ+i+rhtYkobNZhvNS/9Mp9OBz+drFArFE3QvfDYAqAFQB6DLBH0MQoSEhMDHxycuOjraz5ixg4MDf9y4cR6WFjqQTJo0CXPnzvXT6XS4fv36veLi4ssAvgZQBRNWYHrDBjBn48aNIUxW1BZhsVgYO3ase2JiYtipU6c2V1RUZAAIAmDyW4ydmpo6n/kq2j6vvfaaR0FBQUJVVdVBANNMScuWSCSkrsVvAW9v7xeKi4s3A9gIYBCdNGy5XH6pf6tl+xAEgWXLls2oqKjYC4B0rVAPi8/niysrK/f7+PgM6//q2T7Nzc0d4eHhH7LZ7PNUYQnKiIiIrbW1tfeNZfhbmCI5OzsLjh49ug4AqTfB4vP5GDFiBAiCGFNZWbmLaoxraGh4uHbt2ixnZ2eNQCBg63Q6PHnyRKtWq3UAYG9vzyGIbtevq6tL19XVpQUAgiBY9vb2bKBb+La2No3+H0CWhsfjsfVbg2q1Gu3t7Rqg+y0oEok4+pXf9vb2nvJ5PB6bIAiWVColHB0dB4lEomFjx44dMXz4cOmQIUMcTBFPqVSqfX19VzY3N9f3fdZ7RvBNUFDQppKSks0ikcjg/MjT09M5ICBgkkKhSHv40OzN8gEnODjYydvb+4+rV6+eO3HiRFrDkFgsJgoLCzf5+fnFA/hf72d9556XoqKi9qlUKoMZcTgcVnx8/CwAcSwWC42NjWZ8BavQAuDfQUFBMQsWLNhx5coVWgEh3t7eLnv37n136tSpUKlUPZehVY5TsbGxB6ky27RpUxiACABobGxEbS3lPoot0Q7gdEBAwLtHjx79is4YLZPJpgAI7n2PbLk7Lzk5+QRVZunp6UsA9OwblJeX48QJyiS2RCuADatWrTpMxzgrKysGgET/mejs7ER9/c9j3aVLPW7bfhcXl9+tWLHC4A4Ui8VCXl7e6pCQkHYAZ/X3CwoK0NLSgiVLlpj8TaxAbkxMjObAgQPRVEaDBw+2X7hwYbBcLv8EoN5Y0a1atWp3QUFBFZmBUCgkjhw5sgbALyIfDx8+jLy8PLqVtyby7OzsCmNG69atmwtgMGB8Y6U9IiIiZciQIenTpk3zNGTg5uYmLioqSvXx8VkJ4Hbf53rhli9fbqxeA8qiRYt6/j548OB2Ly8v1+nTp5OuJbq7uzssXrz4DQC5dLbw2oODgxMvXrz4HZmBm5ubuLS0dAcAFzKbzMxMZGZm0ijOKnQmJSUdMmY0Y8aMiSdOnKC9Wdy8dOnSnVSzhtGjR7scOnTobzAy6c3KyoJcLqdZLPMcO3YMSqUSGo3mmevChQtVx48fr6ZK++qrr/4BgLspATD1oaGhm5RKpWEnDkBISMgrGRkZCXh2CdogeXl5tjbmabds2fKJSqUi9UMkEgkvMDBwiqlRQ/UzZ87c2NraSrpkPG/ePN+cnJwU0BAOALKzswek2+bn56O5uRkcDof0qq2trb1x4wblHDwwMPAVcyIhq2JjYw90dHSQ/keioqL8EhISokFTOAC2Mt6pr169epPKYPTo0YMpvxSHwwFBEODxeHB1dYVGo4GzszM8PDxAEERYbm5uHFX62NjY7ObmZnlTUxNaW1tRU1NDq+YymQw8Hq8nOPnphB1Az4QdvSbsUKvVAAAejweCICCVSuHo6AiRSITLly/TKrMXYTk5OaTf6/bt202WBCr/c/369YO3bds2j8xg9+7dSyIjI9sA/MuUjJlyUz777DNzkt3W6XSk8XMSiYQ8ToMmmenp6ZKVK1fONPSQz+dzDh8+vHLWrFkPAJi8QqzvstHRlA67Qa5evQoXF1IPiIof29vbNUKhkGPooVAoJFgMRCTyPv30000ymWwymcHDhw87AgICEmpqar6xpCCZTEare1ZVkU5i6CAtLy//h6OjI9nBBSUTB8q6oqKitpw5c+YXi3V6Bg0aJMjMzFwDwKITFHRclOrqav0GsrmX0VbEREsDl8uFWCyWVlRU7B4zZozBOBCVSoW0tLRlAL61tLzPP/8c+p10sVjcE97F0FGgFy5dunREIpGQtjQmD5TdDw0NTfnyyy8/9PT0dDZk4OLiYnCcYApnZ2fcv290q8MYOhg5XcOkaADwbVhY2JazZ8/udHBweGbJvKqq6rvY2NgblhbQ0tKCjz/+mPS5SCTC48ePLS2GEqZFA4CvZ8+evTEjIyN+/PjxrgBQXl7ekJCQsB8A6RSMDgqFgtaOmJ+fHzo6Oswthkvod3oMoNVq+0U0AKjy9/ePmTZt2ktqtRpnzpy5Mn78eIuidRQKhUn2Tk5OePDggTlFOdvb25Pq0tnZqekv0QDgMSjOFJiCqYLpGTp0qDlph3I45ENva2trV3+KxgjmCqbn9ddfx549e2hP4TIyMsYbqc8Tpg/+M4qlgpkBa8qUKV5UBjdv3myx2ZbGtGAvvvginbfqsJEjR7pSGZSUlFy3yZbWXy1sw4YNkEqlsLe3N3itWbNmAVl0AQB0dHRoysrKvrI50azQJfWMXL58+Z+oDKqrq7+rra29aVPdc6AE27BhA+rq6lBdXY22tjb4+vpiwoQJi/h8PmUjOn/+/HUAWptpaVZsYQAQGRkZSRlCqlQq1YcOHSr28vJi/GdzzMLKgk3avn37QmMLFwcPHixBd2h9v80IaGNlwaaVlpZ+QHVoDuiOm9u3b98x/WerimZlwZYVFhb+RSgUGtUgKSkpD8Ad/WeriWZFwV4C8HZaWhqtMPhz58417N69+5Pe96wimhUE4wDwBPB2ZWVloEAgoLXy2tra2hUXF/d39DkaNOCiMSSYHbpPmnDRLYheBC26FxC5ABwBDAcwNi8v7/deXl7DBAKBSS++uXPnbkP3kaBnGFDRGBCMD2BqaWnpnwF4AOCyngL0HCjTsdlsjkgkIsz9FcLOzk7N6tWrD6NX3F1vBlQ0BweTAqwNEQRABsAJJuzem4JGo8FTwUijdAbMT6uupgzIoct0AM7oJ8EePXqkmj179iZQCAYMoGgMYXFTJaOsrKxu+vTp6wBUGLMdENH0m7m2SFtbm3rdunXymTNnvgfgGp00/S5acXExk9n9ADN+vM4QCoXip+3bt58cN25cNIBsmHDiuF9FKyoqYjrLM6D582KGaGtr01RUVNRt3br1uI+PTxyAPTAQJ2wMgux0ChNoNIyfuz8LQAAgBBRhqlqtVtfZ2alRKBQdjx8/bq+vr/+hpqbmellZ2X82b95MGjtMl+ftRWAT/B9Nsbqk1UkTIgAAAABJRU5ErkJggg=="
        />
      </Defs>
    </Svg>
  );
}

function SvgChevronRight({width = 24, height = 24, ...props}: SvgProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <Path d="M9 18l6-6-6-6" />
    </Svg>
  );
}

function SvgMail({width = 27, height = 27, ...props}: SvgProps) {
  return (
    <Svg
      {...props}
      width={width}
      height={height}
      viewBox="0 0 27 27"
      fill="none">
      <Path fill="url(#pattern0_601_177)" d="M0 0H27V27H0z" />
      <Defs>
        <Pattern
          id="pattern0_601_177"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}>
          <Use xlinkHref="#image0_601_177" transform="scale(.01042)" />
        </Pattern>
        <Image
          id="image0_601_177"
          width={96}
          height={96}
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAE6GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjAgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTEwLTIxVDEzOjM1OjE4KzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0xMi0xMVQyMDoyOTo0OFoiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMTItMTFUMjA6Mjk6NDhaIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3MTUzZTZmOC05ZmIwLTQ1YmUtYTBkMC04ZDEzNWQ3MjMwZDMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzE1M2U2ZjgtOWZiMC00NWJlLWEwZDAtOGQxMzVkNzIzMGQzIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NzE1M2U2ZjgtOWZiMC00NWJlLWEwZDAtOGQxMzVkNzIzMGQzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo3MTUzZTZmOC05ZmIwLTQ1YmUtYTBkMC04ZDEzNWQ3MjMwZDMiIHN0RXZ0OndoZW49IjIwMjQtMTAtMjFUMTM6MzU6MTgrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMy4wIChNYWNpbnRvc2gpIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pu3gr8wAAARLSURBVHic7Z0/jFRVFIe/XYgkxKVnE1haI4QpDMRSIoVmsRI7pdBgozFW2FjZYKMY/0RMbGihWxMTjbZGo3EKjJaLhLV2WS2Iy8/i7ovPze7c8967M+fNzPmSmxBy350z55t7z5s3l8uCJAI/Fr0DmHdCgDMhwJkQ4EwIcCYEOBMCnAkBzoQAZ0KAMyHAmRDgTAhwJgQ4EwKcaSPgFPABcBvYAjTnbWsnF9eAk02TudDgB5lDwPvAq8TM2Y+HwKfAm8ADywVWAYeAL4GnWoc2X3wLPINBgvWTfI1IfhPOAe9ZOlpmwClgSCw7TdkGTgO/jOpkSeorxn7B/zkAvJzrZEns091jmVvO5zpYlqD7wKNFwpk/7gNHRnWwCMh1WGgS0QzSKT+xtjsTApwJAc6UELAGHC8wzrRxFLjRdZASAlaBX4ErpHvfWWcRuAz8BrzYdbASd0F1hqSHdT+0DajnnAauA2cbXDPRu6AB8B0pyKXCY3tyGLgK/Eiz5GcpPQPqbABvALdaXt8XVoGPgJWW17t9D1gGbjK9Rboqsmu0T36WSdyGTluRLlpkc4xzCdqLIf0u0m2KbI6xL0HPAb8b+w7oZ5GuiuxP2JP/B3Cp8ytLyrUcSDos6aqkfwz9K+5Jet7w+uNuq5LWG8S9Lem6pCOy52ffVkpA1QaSvre/F0nSmqTjhjhKt6OSbjSMdSjp7K5xckxUAJIWJV2WtGl8U5L0l6Qrkg4Y4unaqvj+bBHfwT3GyzFxAVVblnTT8u5q/CzpjCGmtq3tDF0ZMWYONwFVuyDpjmGcimqNXTKMbW1tatSGpJcMY+dwF9A2AfckXTSOn/sArDd43d1FdiYEVG2gyRXpZZUpsjMlAI2/SHcpsm1uAnL0TkD9E1q6SLedYSsd3keO3gqoWtsiXV+jx1lkx5qfvmxLWQLeAV7D/sDuLvD6zp8/BI4Zr9smPV5+m7Rvpyud8tMXARUD0nOiMwXHrDOk/MPAmdoXNASeJCWpxKez4m/gLeAJevYktm8zoM4yaVv8xY7jfEFa2u50DWgfZmoG1NkAXqDZ4+7d118CLjC+5HemzwIq1oDHgHdJBTTHQ+CznWs679sZN31egvZiwOgiPWTyv7jN7BK0F0P+K9Kbtb/vbZHNMW0zoM4x0v0/pO8Dd53imKnvAdPIXC1BM0cIcCYEOBMCnAkBzoQAZ0KAMyHAmRDgTAhwJgQ4EwKcCQHOhABnQoAzBw19thh9YFP8R2T7s5nrYJkBbXYkBIls7iwCvi4QyLzyVa6D5SfJk6Qfw6fhH1n3iWLHVt4mbQUJmvEJmeSD/ejiR0hHF5/rGNS88A3wLAWPLn5AOgv5Y2y70+aVbdJWGVPyodnp6RWPk06EPQ+cIM4U3QLWSTcrn2NYduq0ERAUJL4JOxMCnAkBzoQAZ0KAMyHAmRDgTAhwJgQ4EwKcCQHOhABnQoAzIcCZEODMvyRozP0DTZjdAAAAAElFTkSuQmCC"
        />
      </Defs>
    </Svg>
  );
}

function SvgLock({width = 34, height = 34, ...props}: SvgProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 34 34"
      fill="none"
      {...props}>
      <Path fill="url(#pattern0_601_181)" d="M0 0H34V34H0z" />
      <Defs>
        <Pattern
          id="pattern0_601_181"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}>
          <Use xlinkHref="#image0_601_181" transform="scale(.01042)" />
        </Pattern>
        <Image
          id="image0_601_181"
          width={96}
          height={96}
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAE6GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjAgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTEwLTIxVDEzOjM2OjM0KzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0xMi0xMVQyMDoyOTo0M1oiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMTItMTFUMjA6Mjk6NDNaIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmNGVlN2ZmYi1hNTMyLTRkY2EtODMyMi04ZDA3MjcyMzkxZTMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6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"
        />
      </Defs>
    </Svg>
  );
}
function SvgProfile({width = 29, height = 29, ...props}: SvgProps) {
  return (
    <Svg
      {...props}
      width={width}
      height={height}
      viewBox="0 0 29 29"
      fill="none">
      <Path fill="url(#pattern0_601_142)" d="M0 0H29V29H0z" />
      <Defs>
        <Pattern
          id="pattern0_601_142"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}>
          <Use xlinkHref="#image0_601_142" transform="scale(.01042)" />
        </Pattern>
        <Image
          id="image0_601_142"
          width={96}
          height={96}
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAE6GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjAgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTEwLTIxVDEzOjM0OjMzKzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0xMi0xMVQyMDoyOTo1NFoiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMTItMTFUMjA6Mjk6NTRaIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowYzk3YjEwNS0xYjNkLTRlN2EtYWE5OC0xOWZjZWYwZWEwMTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6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"
        />
      </Defs>
    </Svg>
  );
}

function SvgTimer({width = 21, height = 27, ...props}: SvgProps) {
  return (
    <Svg
      {...props}
      width={width}
      height={height}
      viewBox="0 0 21 27"
      fill="none">
      <Path fill="url(#pattern0_622_81)" d="M0 0H21V27H0z" />
      <Defs>
        <Pattern
          id="pattern0_622_81"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}>
          <Use
            xlinkHref="#image0_622_81"
            transform="matrix(.01887 0 0 .01468 0 -.006)"
          />
        </Pattern>
        <Image
          id="image0_622_81"
          width={53}
          height={69}
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,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"
        />
      </Defs>
    </Svg>
  );
}

function SvgInformation({width = 24, height = 24, ...props}: SvgProps) {
  return (
    <Svg
      {...props}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none">
      <Circle cx={12} cy={12} r={11.25} stroke="#fff" strokeWidth={1.5} />
      <Path
        d="M12 18V9.5"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={7} r={1} fill="#fff" />
    </Svg>
  );
}

function SvgSetting({width = 25, height = 17, ...props}: SvgProps) {
  return (
    <Svg
      {...props}
      width={width}
      height={height}
      viewBox="0 0 25 17"
      fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.18 4.75a4.02 4.02 0 000-1.5h3.07a.75.75 0 010 1.5h-3.07zm-7.86 0H.75a.75.75 0 010-1.5h12.57a4.02 4.02 0 000 1.5z"
        fill="#fff"
      />
      <Circle cx={17.25} cy={4} r={3.5} stroke="#fff" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.18 13.75a4.02 4.02 0 000-1.5h12.07a.75.75 0 010 1.5H12.18zm-7.86 0H.75a.75.75 0 010-1.5h3.57a4.021 4.021 0 000 1.5z"
        fill="#fff"
      />
      <Circle cx={8.25} cy={13} r={3.5} stroke="#fff" />
    </Svg>
  );
}

function SvgMoon({width = 25, height = 34, ...props}: SvgProps) {
  return (
    <Svg
      {...props}
      width={width}
      height={height}
      viewBox="0 0 25 34"
      fill="none">
      <Path fill="url(#pattern0_705_4509)" d="M0 0H25V34H0z" />
      <Defs>
        <Pattern
          id="pattern0_705_4509"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}>
          <Use
            xlinkHref="#image0_705_4509"
            transform="matrix(.00935 0 0 .00687 0 .022)"
          />
        </Pattern>
        <Image
          id="image0_705_4509"
          width={107}
          height={139}
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,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"
        />
      </Defs>
    </Svg>
  );
}
function SvgPause({width = 31, height = 53, ...props}: SvgProps) {
  return (
    <Svg
      {...props}
      width={width}
      height={height}
      viewBox="0 0 31 53"
      fill="none">
      <Rect
        x={21.75}
        y={0.75}
        width={8.5}
        height={51.5}
        rx={4.25}
        stroke="#fff"
        strokeWidth={1.5}
      />
      <Rect
        x={0.75}
        y={0.75}
        width={8.5}
        height={51.5}
        rx={4.25}
        stroke="#fff"
        strokeWidth={1.5}
      />
    </Svg>
  );
}
function SvgPlay({width = 45, height = 53, ...props}: SvgProps) {
  return (
    <Svg
      fill="#fff"
      width={width}
      height={height}
      x="0px"
      y="0px"
      viewBox="0 0 330 330"
      xmlSpace="preserve"
      enableBackground="new 0 0 330 330"
      {...props}>
      <Path
  transform="translate(30, 0)"
  d="M292.95 152.281L52.95 2.28A15 15 0 0030 15v300a15.001 15.001 0 0022.95 12.72l240-149.999a15 15 0 000-25.44zM60 287.936V42.064l196.698 122.937L60 287.936z"
/>
    </Svg>
  );
}
function SvgPlus({width = 45, height = 46, ...props}: SvgProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 45 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M19.6941 45.7V0.7H25.3941V45.7H19.6941ZM-0.00585929 26.1V20.4H44.9941V26.1H-0.00585929Z"
        fill="white"
      />
    </Svg>
  );
}

function SvgMenuDot({width = 21, height = 5, ...props}: SvgProps) {
  return (
    <Svg
      {...props}
      width={width}
      height={height}
      viewBox="0 0 21 5"
      fill="none">
      <Circle cx={2.5} cy={2.5} r={2.5} fill="#fff" />
      <Circle cx={10.5} cy={2.5} r={2.5} fill="#fff" />
      <Circle cx={18.5} cy={2.5} r={2.5} fill="#fff" />
    </Svg>
  );
}

function SvgChevronDown({width = 37, height = 16, ...props}: SvgProps) {
  return (
    <Svg
      {...props}
      width={width}
      height={height}
      viewBox="0 0 37 16"
      fill="none">
      <Path
        opacity={0.5}
        d="M34.5 2l-16 12L2 2.5"
        stroke="#fff"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SvgRightArrow({width = 22, height = 16, ...props}: SvgProps) {
  return (
    <Svg
      {...props}
      width={width}
      height={height}
      viewBox="0 0 22 16"
      fill="none">
      <Path
        d="M21.707 8.707a1 1 0 000-1.414L15.343.929a1 1 0 10-1.414 1.414L19.586 8l-5.657 5.657a1 1 0 001.414 1.414l6.364-6.364zM0 9h21V7H0v2z"
        fill="#fff"
      />
    </Svg>
  );
}

function SvgRightChev({width = 12, height = 28, ...props}: SvgProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 12 28"
      fill="none"
      {...props}>
      <Path
        opacity={0.5}
        d="M2 2l8 11.815L2.333 26"
        stroke="#fff"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SvgEyeOpen({width = 24, height = 24, ...props}: SvgProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={12} r={3} stroke="currentColor" strokeWidth={2} />
    </Svg>
  );
}

function SvgEyeOff({width = 24, height = 24, ...props}: SvgProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.084 14.158a3 3 0 0 1-4.242-4.242"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 2l20 20"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const SvgellipsisVertical = (props: SvgProps) => (
  <Svg
    viewBox="0 0 24 36"
    width={props.width || 10}
    height={props.height || 60}
    fill="none"
    {...props}>
    <Circle cx={12} cy={6} r={1.5} fill={props.stroke || 'gray'} />
    <Circle cx={12} cy={12} r={1.5} fill={props.stroke || 'gray'} />
    <Circle cx={12} cy={18} r={1.5} fill={props.stroke || 'gray'} />
    <Circle cx={12} cy={24} r={1.5} fill={props.stroke || 'gray'} />
    <Circle cx={12} cy={30} r={1.5} fill={props.stroke || 'gray'} />
  </Svg>
);

const SvgEllipsisHorizontal = (props: SvgProps) => (
  <Svg
    width={props.width || 60}
    height={props.height || 10}
    fill="none"
    // stroke="currentColor"
    // strokeLinecap="round"
    // strokeLinejoin="round"
    // strokeWidth={2}
    {...props}>
    <Circle cx={7} cy={12} r={2} fill={props.stroke || 'gray'} />
    <Circle cx={14} cy={12} r={2} fill={props.stroke || 'gray'} />
    <Circle cx={21} cy={12} r={2} fill={props.stroke || 'gray'} />
    <Circle cx={28} cy={12} r={2} fill={props.stroke || 'gray'} />
    <Circle cx={35} cy={12} r={2} fill={props.stroke || 'gray'} />
  </Svg>
);

export {
  SvgSettings,
  SvgBack,
  SvgHome,
  SvgMoon,
  SvgRightChev,
  SvgRightArrow,
  SvgProfile,
  SvgMenu,
  SvgError,
  SvgMail,
  SvgChevronDown,
  SvgLock,
  SvgMenuDot,
  SvgTimer,
  SvgSetting,
  SvgInformation,
  SvgPause,
  SvgPlay,
  SvgGoogle,
  SvgHeart,
  SvgCircleArrow,
  SvgHeadphones,
  SvgChevronRight,
  SvgEyeOpen,
  SvgEyeOff,
  SvgellipsisVertical,
  SvgEllipsisHorizontal,
  SvgPlus,
};

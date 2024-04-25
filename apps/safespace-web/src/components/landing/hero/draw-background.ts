import { robotomonoFont } from "@/utils/load-mono-font";

const TEXT_GAP = 12;
const TEXT_WIDTH = 22;
const TEXT_HEIGHT = 16;

const isBrowser = typeof window !== "undefined";

interface PixelRatio {
  (): number;
}

const getPixelRatio: PixelRatio = () => {
  const isDevicePixelRatio = isBrowser && window.devicePixelRatio;
  return isDevicePixelRatio || 1;
};

interface RandomString {
  (length: number): string;
}

const getRandomString: RandomString = (length: number) => {
  const digits = "ABCDEF0123456789";
  let string = "";
  const random = Math.random();
  const randomStr = digits.charAt(random * digits.length || 0);
  for (string; string.length < length; string += randomStr);
  return string;
};

interface DrawNumbersArgs {
  rows: number;
  columns: number;
  context: CanvasRenderingContext2D;
  updateRandom: () => void;
}

async function drawNumbers({
  rows,
  columns,
  context,
  updateRandom,
}: DrawNumbersArgs) {
  if (!robotomonoFont) return;
  await robotomonoFont.load().then((font: FontFace) => {
    document.fonts.add(font);
    document.fonts.ready.then(() => {
      updateRandom();
      for (let i = 0; i < rows; i += 1) {
        for (let j = 0; j < columns; j += 1) {
          context.fillText(
            getRandomString(2),
            TEXT_GAP + j * (TEXT_GAP + TEXT_WIDTH),
            i * (TEXT_GAP + TEXT_HEIGHT),
          );
        }
      }
    });
  });
}

let timer: NodeJS.Timeout | null = null;

interface DrawBackgroundArgs {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  width: number;
  height: number;
}

const drawBackground = ({ canvasRef, width, height }: DrawBackgroundArgs) => {
  const canvas = canvasRef.current!;
  const context = canvas.getContext("2d")!;

  const ratio = getPixelRatio();
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.scale(ratio, ratio);
  context.font = "300 16px Roboto Mono";
  context.fillStyle = "gray";

  const columns = Math.round(width / (TEXT_GAP + TEXT_WIDTH));
  const rows = Math.round(height / (TEXT_GAP + TEXT_HEIGHT));

  function updateRandom() {
    clearTimeout(timer!);
    timer = setInterval(() => {
      for (let i = 0; i < 50; i += 1) {
        const rndColumn = Math.round((Math.random() * width) / TEXT_WIDTH);
        const rndRow = Math.round((Math.random() * height) / TEXT_HEIGHT);
        const x = TEXT_GAP + rndColumn * (TEXT_GAP + TEXT_WIDTH);
        const y = TEXT_GAP + rndRow * (TEXT_GAP + TEXT_HEIGHT);

        context.fillStyle = "#ffffff";
        context.fillRect(x, y, TEXT_WIDTH, TEXT_HEIGHT);

        context.fillStyle = "lightgray";
        context.fillText(getRandomString(2), x, y + TEXT_HEIGHT);
      }
    }, 10);
  }

  drawNumbers({ rows, columns, context, updateRandom });
};

export default drawBackground;

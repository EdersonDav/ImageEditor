const sharp = require("sharp");
const compress_images = require("compress-images");
const fs = require("fs");

let path = process.argv[2];
let width = Number(process.argv[3]);

function resize(path, pathOutput, width) {
  sharp(path)
    .resize({ width: width })
    .toFile(pathOutput, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Imagem rediensionada com sucesso!");
        compress(pathOutput, "./compressed/");
      }
    });
}

function compress(INPUT_path, OUTPUT_path) {
  compress_images(
    INPUT_path,
    OUTPUT_path,
    { compress_force: false, statistic: true, autoupdate: true },
    false,
    { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
    { png: { engine: "pngquant", command: ["--quality=20-50"] } },
    { svg: { engine: "svgo", command: "--multipass" } },
    {
      gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] },
    },
    function (error, completed, statistic) {
      console.log("-------------");
      console.log(error);
      console.log(completed);
      console.log(statistic);
      console.log("-------------");
    }
  );
  fs.unlink(INPUT_path, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("sucess");
    }
  });
}

resize(path, `./temp/output_resize${width}.jpg`, width);

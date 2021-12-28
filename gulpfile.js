"use strict";

/*
src 参照元を指定
dest 出力先を指定
watch ファイル監視
series(直列処理)とparallel(並列処理)
*/
const { src, dest, watch, series, parallel } = require("gulp");

//scss
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber"); // エラーが発生しても強制終了させない
const autoprefixer = require("gulp-autoprefixer"); //prefix自動付与
const sassGlob = require("gulp-sass-glob-use-forward"); //グロブ機能
const notify = require("gulp-notify"); // エラー発生時のアラート出力
const cleanCSS = require("gulp-clean-css"); // 圧縮
const rename = require("gulp-rename"); // ファイル名変更
const sourcemaps = require("gulp-sourcemaps"); // ソースマップ作成

//js babel
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");

//画像圧縮
const imagemin = require("gulp-imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
const imageminSvgo = require("imagemin-svgo");

//ファイル監視
const browserSync = require("browser-sync");

//参照元パス
const srcPath = {
  scss: "src/sass/**/*.scss",
  js: "src/js/**/*.js",
  img: "src/images/**/*.{jpg,jpeg,png,svg}",
  html: "./**/*.html",
  php: "./**/*.php",
};

//出力先パス
const destPath = {
  css: "dist/css/",
  js: "dist/js/",
  img: "dist/images/",
};

// sass
const cssSass = () => {
  return src(srcPath.scss)
    .pipe(sourcemaps.init()) //gulp-sourcemapsを初期化
    .pipe(
      plumber(
        //エラーが出ても処理を止めない
        {
          errorHandler: notify.onError("Error:<%= error.message %>"),
          //エラー出力設定
        }
      )
    )
    .pipe(sassGlob()) //glob機能
    .pipe(sass({ outputStyle: "expanded" })) //コンパイルオプション
    .pipe(sourcemaps.write("/maps")) //ソースマップの出力
    .pipe(dest(destPath.css)) //コンパイル先
    .pipe(cleanCSS()); // CSS圧縮
};

// babelのトランスパイル、jsの圧縮
const jsBabel = () => {
  return src(srcPath.js)
    .pipe(
      plumber(
        //エラーが出ても処理を止めない
        {
          errorHandler: notify.onError("Error: <%= error.message %>"),
        }
      )
    )
    .pipe(
      babel({
        presets: ["@babel/preset-env"], // gulp-babelでトランスパイル
      })
    )
    .pipe(dest(destPath.js))
    .pipe(uglify()) // js圧縮
    .pipe(rename({ extname: ".min.js" }))
    .pipe(dest(destPath.js));
};

//画像圧縮（デフォルトの設定）
const imgImagemin = () => {
  return src(srcPath.img)
    .pipe(
      imagemin(
        [
          imageminMozjpeg({
            quality: 80,
          }),
          imageminPngquant(),
          imageminSvgo({
            plugins: [
              {
                removeViewbox: false,
              },
            ],
          }),
        ],
        {
          verbose: true,
        }
      )
    )
    .pipe(dest(destPath.img));
};

//ローカルサーバー立ち上げ、ファイル監視と自動リロード
const browserSyncFunc = () => {
  browserSync.init(browserSyncOption);
};
const browserSyncOption = {
  // proxy: "localhost:3000", //環境によって切り替える（WordPressで使用）
  server: { baseDir: "./" }, //環境によって切り替える（Webコーディングで使用）
  startPath: "index.html",
  open: true,
  reloadOnRestart: true,
};

//リロード
const browserSyncReload = (done) => {
  browserSync.reload();
  done();
};

//ファイル監視
const watchFiles = () => {
  watch(srcPath.scss, series(cssSass, browserSyncReload));
  watch(srcPath.js, series(jsBabel, browserSyncReload));
  watch(srcPath.img, series(imgImagemin, browserSyncReload));
  watch(srcPath.html, series(browserSyncReload));
  watch(srcPath.php, series(browserSyncReload));
};

// タスクをまとめて実行
exports.default = series(series(cssSass, jsBabel, imgImagemin), parallel(watchFiles, browserSyncFunc));

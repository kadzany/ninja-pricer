const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const minifyHtml = require('gulp-html-minify');
const browserSync = require('browser-sync').create();


// Define paths
const paths = {
  src: {
    html: 'src/**/*.html',
    header: 'src/header.html',
  },
  dest: 'dist',
};

// Task to include the header in the HTML file
gulp.task('include-header', () => {
  return gulp.src(paths.src.html)
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file',
    }))
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream());
});

// Define a task to minify HTML files
gulp.task('minify-html', () => {
  return gulp
    .src('dist/**/*.html') // Minify the included HTML files
    .pipe(minifyHtml({ js: true, minifyJSOptions: { warnings: true } })) // Minify HTML and obfuscate JavaScript
    //.pipe(terser()) // Further obfuscate JavaScript
    .pipe(gulp.dest('dist'));
});

// Task to move and optimize images
gulp.task('images', () => {
  return gulp.src('src/img/**/*')
      //.pipe(image()) // You can add image optimization here if needed
      .pipe(gulp.dest('dist/img'));
});

// Task to serve the project and watch for changes
gulp.task('serve', () => {
  browserSync.init({
    server: './dist',
  });

  gulp.watch('src/**/*.html', gulp.series('include-header'));
  gulp.watch('dist/*.html').on('change', browserSync.reload);
});

// Default task to include the header and start the development server
gulp.task('default', gulp.series('images', 'include-header', 'minify-html', 'serve'));

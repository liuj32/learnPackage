
/* child.js */
process.on('SIGTERM', function () {
  console.log(1111)
  cleanUp();
  process.exit(0);
});
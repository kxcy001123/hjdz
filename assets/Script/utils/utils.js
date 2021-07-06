const utils = {};
module.exports = utils;


utils.getDayDate = function (curDate) {
  curDate = curDate || new Date();
  return curDate.toLocaleDateString();
}
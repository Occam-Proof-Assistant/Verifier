"use strict";

const { HELP_OPTION, TAIL_OPTION, FOLLOW_OPTION, VERBOSE_OPTION, VERSION_OPTION, LOG_LEVEL_OPTION } = require("./options");

const h = HELP_OPTION,
      t = TAIL_OPTION,
      f = FOLLOW_OPTION,
      x = VERBOSE_OPTION,
      v = VERSION_OPTION,
      l = LOG_LEVEL_OPTION

module.exports = {
  h,
  t,
  f,
  x,
  v,
  l
};

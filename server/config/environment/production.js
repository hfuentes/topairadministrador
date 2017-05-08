'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP ||
    process.env.IP ||
    undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT ||
    process.env.PORT ||
    8080,

  // MongoDB connection options
  mongo: {
    uri: process.env.MONGOLAB_URI ||
      process.env.MONGOHQ_URL ||
      process.env.OPENSHIFT_MONGODB_DB_URL +
      process.env.OPENSHIFT_APP_NAME ||
      'mongodb://topairadministrador-2851:Sc2*6J)d$3Ht}*5Fd$3Zt}Fd{9)@db-topairadministrador-2851.nodechef.com:5403/topairadministrador'
  }
};


const dns = require("dns");

console.log("DNS:", dns.getServers());

dns.resolveSrv("_mongodb._tcp.cluster0.cpdow8r.mongodb.net", (err, records) => {
    console.log(err || records);
});
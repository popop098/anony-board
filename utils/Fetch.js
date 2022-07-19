module.exports.fetcher = (url,option={}) => fetch(url,option).then((res) => res.json());

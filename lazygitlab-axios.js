axios = require('axios');
// gitlab = axios.create({
//   baseURL: "https://www.gitlab.com",
//   headers: {
//     'PRIVATE-TOKEN': "jvBukuh6y8xTd6MyLwFz"
//   }
// });
// console.log(gitlab);
// groups = gitlab.get('/api/v4/groups\?per_page\=999');
// console.log(groups);

gl = axios.create({
  baseURL: "https://www.gitlab.com",
  json: true,
  qs: {simple: true},
  headers: {'PRIVATE-TOKEN': "jvBukuh6y8xTd6MyLwFz"}
});

let gids = [];
let projects = [];
return gl.get('/api/v4/groups\?per_page\=999')
  .then((groups) => {
    function getId(group) {
      gids.push(group.id);
    }
    return groups.data.map(getId);
  })
  .then(() => {
    console.log(gids);
    for (let id of gids) {
      return gl.get('/api/v4/groups/${id}/projects\?per_page\=999')
	.then((prjs) => {
	  console.log(prjs);
	});
    }
  });

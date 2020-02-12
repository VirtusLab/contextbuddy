const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
	try {
		const {
			context: {
				payload: {
					repository: {
						full_name
					}
				}
			}
		} = github

		const owner = full_name.replace(/\/.+/, '')
		const repo = full_name.replace(/.+\//, '')


	  const userKey = core.getInput('user-key')
	  const octokit = new github.GitHub(userKey)
// 	  const repoResponse = await octokit.request("GET /repos/:owner/contextbuddy-storage", {
// 	  	owner
// 	  })
// 	  if(repoResponse.status == "200") 
		  
		  
// 	  console.log(`Repos res: ${JSON.stringify(repoResponse)}`)

	  // create repo or retrieve caches
	
	  const res = await octokit.request("POST /user/repos", {
		name: "contextbuddy-storage",
		private: true,
	  })


	  console.log(`Req res: ${res.status}`);
	} catch (error) {
	  core.setFailed(error.message);
	}
}

run()

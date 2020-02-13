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
	  
	  // find out whether repo exists 
	  // if not create it
	  const repoResponse = await octokit.request("HEAD /repos/:owner/contextbuddy-storage", {
	  	owner
	  })
	  
// 	  if(repoResponse.status == "200") 
		  
		  
	  console.log(`Repos res: ${JSON.stringify(repoResponse)}`)

// 	  const res = await octokit.request("POST /user/repos", {
// 		name: "contextbuddy-storage",
// 		private: true,
// 	  })


// 	  console.log(`Req res: ${JSON.stringify(res)}`);
	} catch (error) {
	  core.setFailed(error.message);
	}
}

run()

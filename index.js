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


	  const userKey = core.getInput('user-key')

	  // create repo or retrieve caches
	  const octokit = new github.GitHub(userKey)
	  const res = await octokit.request("POST /users/:owner/repos", {
	  	owner,
		name: "contextbuddy-storage",
		private: true,
	  })


	  console.log(`Req res: ${res}`);
	} catch (error) {
	  core.setFailed(error.message);
	}
}

run()

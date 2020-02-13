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
	  const existsRepo = () =>  octokit.request("HEAD /repos/:owner/contextbuddy-storage", {
	  		owner
	 	 })
	  
	  const createRepo = () => octokit.request("POST /user/repos", {
			name: "contextbuddy-storage",
			private: true,
	  	})
	  
	  try {
	  	await existsRepo()
		 console.log("repo exists")
	  } catch (error) {
		if (error.status !== 404) return // connection error
		console.log("repo will be created")
		await createRepo()
	  }
	} catch (error) {
	  core.setFailed(error.message);
	}
}

run()

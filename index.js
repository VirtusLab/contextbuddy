const core = require('@actions/core')
const github = require('@actions/github') 

async function run() {
	try {
		const {
			context: {
				payload: {
					pull_request,
					repository
				}
			}
		} = github


		if(!pull_request || !pull_request.merged) return

		const commentsUrl = pull_request._links.review_comments.href
		const commentsEndpoint = commentsUrl.replace('https://api.github.com', '')

		const repoToken = core.getInput('repo-token')
		const octokit = new github.GitHub(repoToken, {
			previews: ["comfort-fade-preview", "everest-preview"]
		})

		const commentsRes = await octokit.request(commentsUrl)
		const comments = commentsRes.data.map(comment => ({
			path: comment.path,
			user: comment.user.login,
			body: comment.body,
			line: comment.line
		}))
		const content = Buffer.from(JSON.stringify(comments)).toString('base64')

		const storagePath = '.storage'
		const storageFile = await octokit.request(`GET /repos/${repository.full_name}/contents/${storagePath}`)
		const storage = {
		  owner: repository.owner.login,
		  repo: repository.name,
		  path: storagePath,
		  message: 'Add context for PR ' + pull_request.number,
		  content
		}

		if(storageFile.status == '200') storage.sha = storageFile.data.sha		

		octokit.repos.createOrUpdateFile(storage)

	} catch (error) {
	  core.setFailed(error.message)
	}
}

run()

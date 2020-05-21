const core = require('@actions/core')
const github = require('@actions/github')
const { graphql } = require("@octokit/graphql");
const fs = require('fs')

async function run() {
	try {
		const {
			context: {
				payload: {
					repository: {
						full_name
					},
				}
			}
		} = github


		const repoToken = core.getInput('repo-token')
		const repo = full_name.replace(/.+\//, '')
		const owner = full_name.replace(/\/.+/, '')

		const res = await graphql(`query Query($owner: String!, $repo: String!) {
			repository(owner: $owner, name: $repo) {
				pullRequests(last: 1) {
					nodes {
				  	reviewThreads(first:10){
				      nodes {
					    line
				          comments(first:50) {
				            nodes {
				              body
				              author {
				                login
				              }
				              path
				              outdated
				            }
				          }
				        }
				      }
					}
				}
			}
		  }`,
		  {
		    owner,
		    repo,
		    headers: {
    			authorization: `token ${repoToken}`,
		        accept: 'application/vnd.github.comfort-fade-preview+json'
  		    }
		  })

		const comments = res.repository.pullRequests.nodes[0].reviewThreads.nodes
			.flatMap(thread => thread.comments.nodes.map(node => ({...node, line: thread.line})))
			.filter(comment => !comment.outdated)
			.map(({ body, author: { login }, line, path}) => ({ body, user: login, line, path }))

		const filePath = 'ReviewComments.json'
		fs.writeFile(filePath, JSON.stringify(comments), (err) => {
		  if(err) throw err
		  console.log('The file has been saved!');
		})
	} catch (error) {
	  core.setFailed(error.message);
	}
}

run()
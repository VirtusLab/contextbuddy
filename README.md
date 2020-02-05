# Pull request info action

First make sure that you have the latest version of ContextBuddy sbt plugin added to your project.

Then put the following code in .github/workflows/main.yml

```
on:
   pull_request:
     types: [closed]

jobs:
  generate_snapshot_job:
    runs-on: ubuntu-latest
    name: Generate and save snapshot
    steps:
    - name: Checkout repository
      uses: actions/checkout@v2
    - name: Create temporary file with review comments
      uses: VirtusLab/contextbuddy@gh-actions
      with:
        repo-token: ${{ secrets.GITHUB_TOKEN }}
    - name: Git config # required by sbt generateSnapshot
      run: |
        git config --global user.email "context@buddy.com"
        git config --global user.name "ContextBuddy"
    - name: Generate snapshot
      run: sbt generateSnapshot
    - name: Save snapshot in storage branch
      run: |
        git checkout --orphan contextbuddy/storage
        git rm -rf .
        mv /home/runner/.contextbuddy/$(echo "$GITHUB_REPOSITORY" | awk -F / '{print $2}')/storage/snapshots $GITHUB_WORKSPACE
        git add snapshots
        git commit -m 'Add snapshots'
        git push --set-upstream origin contextbuddy/storage -ff
```

The action will run on each merged pull request. It will generate snapshot for ContextBuddy and save it in dedicated branch
called contextbuddy/storage within your github repository.

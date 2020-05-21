# Generate snapshot action

First make sure that you have the latest version of ContextBuddy sbt plugin added to your project.

Then put the following code in .github/workflows/main.yml

Next add your GitHub Personal Access Token named STORAGE_SECRET to the project which uses the workflow.

The token is required to create and checkout repository named contextbuddy-storage under your profile which will be used to store ContextBuddy snapshots.

```
name: ContextBuddy CI

on:
 push:
  branches:
   - master

jobs:
  generate_snapshot_job:
    runs-on: ubuntu-latest
    name: Generate and save snapshot
    steps:
    - name: Set env
      run: |
       echo ::set-env name=USER_SECRET::${{ secrets.STORAGE_SECRET }}
       echo ::set-env name=OWNER::$(echo "${GITHUB_REPOSITORY/\/*/}")
       echo ::set-env name=REPO::$(echo "${GITHUB_REPOSITORY/*\//}")
    - name: Create storage if not present # if storage existed before then repo-existed output will be set to 'true'
      id: create-storage
      uses: VirtusLab/contextbuddy@storage-gh-actions
      with:
       user-key: ${{ env.USER_SECRET }}
    - name: Checkout storage repository
      uses: actions/checkout@v2
      with:
       repository: ${{ env.OWNER }}/contextbuddy-storage
       token: ${{ env.USER_SECRET }}
    - name: Copy storage
      if: steps.create-storage.outputs.repo-existed == 'true'
      run: mkdir -p ~/.contextbuddy/ && [ ! -f ${{ env.REPO }} ] || cp -r ${{ env.REPO }} ~/.contextbuddy/
    - name: Checkout repository
      uses: actions/checkout@v2
    - name: Cache SBT
      uses: actions/cache@v1.1.2
      with:
        path: ~/.sbt
        key: sbt-${{ runner.os }}-${{ hashFiles('**/*.sbt') }}
    - name: Cache SBT ivy cache
      uses: actions/cache@v1.1.2
      with:
        path: ~/.ivy2/cache
        key: sbt-ivy-${{ runner.os }}-${{ hashFiles('**/*.sbt') }}
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
    - name: Checkout storage repository
      uses: actions/checkout@v2
      with:
       repository: ${{ env.OWNER }}/contextbuddy-storage
       token: ${{ env.USER_SECRET }}
    - name: Save snapshot to storage
      run: |
       cp -rf ~/.contextbuddy/$REPO ./
       rm -rf $REPO/storage/.git
       git add .
       git commit -m 'Update snapshot'
       git push -ff
    - name: Checkout repository # checkout repository again so that cache action could hash *.sbt files
      uses: actions/checkout@v2
```

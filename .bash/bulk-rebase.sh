#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Ensure all remote branches are up-to-date
echo "Fetching all branches..."
git fetch --all

# Define main branch
MAIN_BRANCH="main"

# Update the main branch
echo "Updating '$MAIN_BRANCH' branch..."
git checkout $MAIN_BRANCH
git pull origin $MAIN_BRANCH

# Define the sub-main branches to be rebased
SUB_BRANCHES=("main-hyd" "main-hyd-career" "main-hyd-class" "main-hyd-mentor")

# Loop through each branch and rebase it
for BRANCH in "${SUB_BRANCHES[@]}"; do
  echo ""
  echo "Rebasing branch '$BRANCH'..."
  git checkout "$BRANCH"

  # Determine the correct upstream branch
  if [[ "$BRANCH" == main-hyd-* ]]; then
    echo "Pulling changes from main-hyd"
    git pull origin main-hyd --rebase >/dev/null 2>&1
  else
    echo "Pulling changes from main"
    git pull origin main --rebase >/dev/null 2>&1
  fi

  # Push the rebased branch
  git push origin "$BRANCH"
  echo "Done!"
  echo ""
done

git checkout $MAIN_BRANCH

echo "All branches rebased successfully!"

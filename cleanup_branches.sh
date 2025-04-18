#!/bin/bash

# Script to clean up all remote branches except main

echo "Deleting all remote branches except main from origin..."

# Get all remote branches except main
BRANCHES=$(git branch -r | grep origin/ | grep -v 'origin/main' | sed 's/origin\///')

# Delete each branch
for branch in $BRANCHES; do
  echo "Deleting branch $branch from origin..."
  git push origin --delete $branch
done

echo "Deleting all remote branches except main from temp-origin..."

# Get all remote branches except main
TEMP_BRANCHES=$(git branch -r | grep temp-origin/ | grep -v 'temp-origin/main' | sed 's/temp-origin\///')

# Delete each branch
for branch in $TEMP_BRANCHES; do
  echo "Deleting branch $branch from temp-origin..."
  git push temp-origin --delete $branch
done

echo "All cleanup complete. Only main branches remain." 
#!/bin/bash
# VividWealth Rollback Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}VividWealth Rollback Script${NC}"
echo "This script will help you roll back to a previous stable version."

# Check if Git is initialized
if [ ! -d .git ]; then
  echo -e "${RED}Error: Not a git repository. Please run this script from the project root.${NC}"
  exit 1
fi

# Function to list tags and releases
list_releases() {
  echo -e "\n${YELLOW}Available releases:${NC}"
  git tag -l "v*" --sort=-v:refname | head -10
  echo ""
}

# Function to list recent commits
list_commits() {
  echo -e "\n${YELLOW}Recent commits:${NC}"
  git log --oneline -n 10
  echo ""
}

# Display available rollback options
list_releases
list_commits

# Ask for rollback target
echo -e "${YELLOW}Rollback options:${NC}"
echo "1) Roll back to a specific tag/release"
echo "2) Roll back to a specific commit"
echo "3) Roll back to previous commit"
echo "4) Exit"

read -p "Select an option (1-4): " option

case $option in
  1)
    list_releases
    read -p "Enter the tag to roll back to (e.g., v1.0.0): " tag
    if ! git rev-parse "$tag" >/dev/null 2>&1; then
      echo -e "${RED}Error: Tag $tag does not exist${NC}"
      exit 1
    fi
    
    echo -e "${YELLOW}Rolling back to tag: $tag${NC}"
    git checkout "$tag"
    ;;
    
  2)
    list_commits
    read -p "Enter the commit hash to roll back to: " commit
    if ! git rev-parse "$commit" >/dev/null 2>&1; then
      echo -e "${RED}Error: Commit $commit does not exist${NC}"
      exit 1
    fi
    
    echo -e "${YELLOW}Rolling back to commit: $commit${NC}"
    git checkout "$commit"
    ;;
    
  3)
    current=$(git rev-parse HEAD)
    previous=$(git rev-parse HEAD~1)
    echo -e "${YELLOW}Rolling back to previous commit: $(git log -1 --pretty=%B $previous)${NC}"
    git checkout "$previous"
    ;;
    
  4)
    echo -e "${YELLOW}Exiting without rollback${NC}"
    exit 0
    ;;
    
  *)
    echo -e "${RED}Invalid option${NC}"
    exit 1
    ;;
esac

# Check if we need to install dependencies
if [ -f "package.json" ]; then
  echo -e "${YELLOW}Installing dependencies...${NC}"
  npm install
fi

echo -e "${GREEN}Rollback complete.${NC}"
echo "You are now in a detached HEAD state. To start developing from this point:"
echo "git checkout -b recovery-branch"
echo ""
echo "To deploy this version:"
echo "npm run deploy" 
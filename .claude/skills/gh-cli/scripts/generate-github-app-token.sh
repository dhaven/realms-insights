#!/bin/bash

################################################################################
# GitHub App Token Generator for Code Reviews
################################################################################
#
# PURPOSE:
# Generates installation access tokens for a GitHub App, allowing AI agents
# to post code reviews using a separate bot identity (not as the repo owner).
#
# WHEN TO USE:
# Use this when the AI agent is acting as a CODE REVIEWER:
# - Reviewing pull requests
# - Approving or requesting changes on PRs
# - Posting review comments
#
# USAGE:
#   # Generate token and export it
#   source .env
#   export GH_TOKEN=$(.claude/skills/gh-cli/scripts/generate-github-app-token.sh)
#
#   # Verify authentication (should show bot identity)
#   gh auth status
#
#   # Post code review
#   gh pr review 123 --approve --body "LGTM!"
#
# REQUIREMENTS:
# - .env file must exist with GITHUB_APP_* credentials configured
# - Private key file (.pem) must be accessible at the path specified in .env
# - openssl and jq must be installed
#
# NOTE: Tokens expire after 1 hour. Re-run this script to generate a new token.
#
################################################################################

set -euo pipefail

# Determine script directory for relative path resolution
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"

# Source environment variables from .env file
ENV_FILE="$PROJECT_ROOT/.env"

if [ ! -f "$ENV_FILE" ]; then
    echo "ERROR: .env file not found at $ENV_FILE" >&2
    echo "Please copy .env.example to .env and fill in your GitHub App credentials" >&2
    exit 1
fi

# Load environment variables
set -a
source "$ENV_FILE"
set +a

# Validate required environment variables
if [ -z "${GITHUB_APP_ID:-}" ]; then
    echo "ERROR: GITHUB_APP_ID is not set in .env" >&2
    exit 1
fi

if [ -z "${GITHUB_APP_INSTALLATION_ID:-}" ]; then
    echo "ERROR: GITHUB_APP_INSTALLATION_ID is not set in .env" >&2
    exit 1
fi

if [ -z "${GITHUB_APP_PRIVATE_KEY_PATH:-}" ]; then
    echo "ERROR: GITHUB_APP_PRIVATE_KEY_PATH is not set in .env" >&2
    exit 1
fi

# Resolve private key path (support both absolute and relative paths)
if [[ "$GITHUB_APP_PRIVATE_KEY_PATH" = /* ]]; then
    PRIVATE_KEY_PATH="$GITHUB_APP_PRIVATE_KEY_PATH"
else
    PRIVATE_KEY_PATH="$PROJECT_ROOT/$GITHUB_APP_PRIVATE_KEY_PATH"
fi

if [ ! -f "$PRIVATE_KEY_PATH" ]; then
    echo "ERROR: Private key file not found at $PRIVATE_KEY_PATH" >&2
    exit 1
fi

# Check for required dependencies
if ! command -v openssl &> /dev/null; then
    echo "ERROR: openssl is required but not installed" >&2
    exit 1
fi

if ! command -v jq &> /dev/null; then
    echo "ERROR: jq is required but not installed (install with: sudo apt-get install jq)" >&2
    exit 1
fi

################################################################################
# Generate JWT Token
################################################################################

# JWT Header
JWT_HEADER=$(echo -n '{"alg":"RS256","typ":"JWT"}' | openssl base64 -e -A | tr '+/' '-_' | tr -d '=')

# JWT Payload
NOW=$(date +%s)
IAT=$((NOW - 60))  # Issued 60 seconds in the past to allow for clock drift
EXP=$((NOW + 600)) # Expires in 10 minutes

JWT_PAYLOAD=$(cat <<EOF | openssl base64 -e -A | tr '+/' '-_' | tr -d '='
{"iat":$IAT,"exp":$EXP,"iss":"$GITHUB_APP_ID"}
EOF
)

# Create signature
JWT_SIGNATURE=$(echo -n "${JWT_HEADER}.${JWT_PAYLOAD}" | \
    openssl dgst -sha256 -sign "$PRIVATE_KEY_PATH" | \
    openssl base64 -e -A | \
    tr '+/' '-_' | \
    tr -d '=')

# Complete JWT
JWT="${JWT_HEADER}.${JWT_PAYLOAD}.${JWT_SIGNATURE}"

################################################################################
# Get Installation Access Token
################################################################################

RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $JWT" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "https://api.github.com/app/installations/$GITHUB_APP_INSTALLATION_ID/access_tokens")

# Extract token from response
TOKEN=$(echo "$RESPONSE" | jq -r '.token')

# Check if token extraction was successful
if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
    echo "ERROR: Failed to generate installation token" >&2
    echo "API Response: $RESPONSE" >&2
    exit 1
fi

# Output the token (this will be captured by the calling script)
echo "$TOKEN"

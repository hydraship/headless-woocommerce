#!/bin/sh

##########################
#### Step 1: Load env vars
##########################

# Path to your .env file
ENV_FILE="/app/.env"

# Read each line from .env file
while IFS='=' read -r key value || [ -n "$key" ]
do
    # Trim leading and trailing whitespace from key
    key=$(echo "$key" | xargs)

    # Skip empty lines and lines starting with #
    case "$key" in
        \#*|"") continue ;;
    esac

    # Use printf to handle values with spaces
    eval "export $(printf "%s='%s'\n" "$key" "$value")"
done < "$ENV_FILE"


#################################
#### Step 2: Replace nextjs cache
#################################

# Path to .env.template file
ENV_TEMPLATE_FILE="/app/deployment/env.template"

# Directories containing the files to be modified
SERVER_DIR="/app/.next"
PUBLIC_DIR="/app/public"

# Temporary file for the sed script
SED_SCRIPT=$(mktemp)

# Ensure that the temporary file is removed on exit
trap "rm -f $SED_SCRIPT" EXIT

# Read each line from .env file
while IFS='=' read -r key value || [ -n "$key" ]
do
    # Skip empty lines
    if [ ! -z "$key" ]; then
        # Remove potential whitespace around the key
        key=$(echo $key | xargs)

        # Get the actual environment variable's value
        actual_value=$(printenv $key)

        # Check if the environment variable exists
        if [ ! -z "$actual_value" ]; then
            # Append the substitution command to the sed script
            echo "s|$value|$actual_value|g" >> $SED_SCRIPT
            # Print the substitution message only for public variables
            case $key in
                NEXT_PUBLIC_*)
                    echo "Substitution of $key: $actual_value"
                    ;;
            esac
        fi
    fi
done < "$ENV_TEMPLATE_FILE"

# Use find to get all files in TARGET_DIR and apply the sed script
echo "Updating values in $SERVER_DIR ...\n"
find $SERVER_DIR -type f -exec sed -i -f $SED_SCRIPT {} \;
echo "Updating values in $PUBLIC_DIR ...\n"
find $PUBLIC_DIR -type f -exec sed -i -f $SED_SCRIPT {} \;

# Execute any arguments supplied to the script
echo "Starting $@"
"$@"
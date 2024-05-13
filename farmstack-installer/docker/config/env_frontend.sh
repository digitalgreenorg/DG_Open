# Set up endpoint for env retrieval
echo "Window.ENV_VARS = {" > /usr/share/nginx/html/env_config.js

# Collect enviroment variables for react
eval enviroment_variables="$(env | grep REACT_APP.*=)"

# Loop over variables
env | grep REACT_APP.*= | while read -r line; 
do
    printf "%s',\n" $line | sed "s/=/:'/" >> /usr/share/nginx/html/env_config.js
    
    # Notify the user
    printf "Env variable %s' was injected into React App. \n" $line | sed "0,/=/{s//:'/}"

done

# End the object creation
echo "}" >> /usr/share/nginx/html/env_config.js

echo "Enviroment Variable Injection Complete."
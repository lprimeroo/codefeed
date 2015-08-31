
echo "Creating Docker Image"
docker build -t 'virtual_machine_codefeed' - < Dockerfile
echo "Retrieving Installed Docker Images"
docker images

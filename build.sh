docker build -t volume-updater .
docker run \
  --volume browsify:/data \
  --rm \
  volume-updater \
  ash -c 'cp -r /web/build /data'
